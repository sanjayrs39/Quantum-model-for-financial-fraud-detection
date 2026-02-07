import os
import warnings
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from tqdm import tqdm
import joblib
from typing import Tuple, Dict, Any, List
from collections import defaultdict

# Suppress warnings
warnings.filterwarnings('ignore')

# Qiskit imports
from qiskit import QuantumCircuit
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes, EfficientSU2
from qiskit.utils import algorithm_globals
from qiskit_machine_learning.algorithms import VQC
from qiskit_machine_learning.neural_networks import SamplerQNN
from qiskit_machine_learning.runtime import Sampler, Session
from qiskit_ibm_runtime import QiskitRuntimeService, Session as IBMSession, Options
from qiskit.algorithms.optimizers import COBYLA
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
from imblearn.over_sampling import RandomOverSampler

# Set random seed for reproducibility
SEED = 42
algorithm_globals.random_seed = SEED

class QuantumFraudDetector:
    def __init__(self):
        """Initialize the quantum fraud detector with configuration."""
        self.results = {}
        self.best_model = None
        self.best_score = 0
        
    def load_data(self, transaction_path: str, identity_path: str, sample_size: int = 1000) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Load and preprocess the fraud detection dataset.
        
        Args:
            transaction_path: Path to the transaction data CSV
            identity_path: Path to the identity data CSV
            sample_size: Number of samples to use for MVP
            
        Returns:
            Tuple of (X, y) where X is the feature matrix and y is the target
        """
        print("Loading and preprocessing data...")
        
        # Load data
        transaction = pd.read_csv(transaction_path)
        identity = pd.read_csv(identity_path)
        
        # Merge datasets on TransactionID
        df = pd.merge(transaction, identity, on='TransactionID', how='left')
        
        # Handle missing values
        for col in df.select_dtypes(include=['float64', 'int64']).columns:
            df[col].fillna(df[col].median(), inplace=True)
            
        for col in df.select_dtypes(include=['object']).columns:
            df[col].fillna(df[col].mode()[0], inplace=True)
        
        # Label encode categorical columns
        le = LabelEncoder()
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = le.fit_transform(df[col].astype(str))
        
        # Sample data for MVP
        if len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=SEED)
        
        # Separate features and target
        X = df.drop('isFraud', axis=1)
        y = df['isFraud']
        
        return X, y
    
    def prepare_features(self, X: pd.DataFrame, n_components: int = 10) -> np.ndarray:
        """
        Apply feature scaling and dimensionality reduction.
        
        Args:
            X: Input features
            n_components: Number of PCA components
            
        Returns:
            Transformed feature matrix
        """
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Apply PCA
        pca = PCA(n_components=n_components, random_state=SEED)
        X_pca = pca.fit_transform(X_scaled)
        
        return X_pca
    
    def balance_data(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Balance the dataset using RandomOverSampler.
        
        Args:
            X: Features
            y: Target
            
        Returns:
            Balanced X and y
        """
        ros = RandomOverSampler(random_state=SEED)
        X_resampled, y_resampled = ros.fit_resample(X, y)
        return X_resampled, y_resampled
    
    def get_quantum_circuit(self, config: Dict[str, Any]) -> QuantumCircuit:
        """
        Create a quantum circuit based on the given configuration.
        
        Args:
            config: Configuration for the quantum circuit
            
        Returns:
            Configured quantum circuit
        """
        num_qubits = config.get('num_qubits', 10)
        
        # Feature map
        if config['feature_map'] == 'ZZFeatureMap':
            feature_map = ZZFeatureMap(
                feature_dimension=num_qubits,
                reps=config.get('fm_reps', 2),
                entanglement=config.get('entanglement', 'full')
            )
        elif config['feature_map'] == 'EfficientSU2':
            feature_map = EfficientSU2(
                num_qubits=num_qubits,
                reps=config.get('fm_reps', 1),
                entanglement=config.get('entanglement', 'full')
            )
        
        # Ansatz
        if config['ansatz'] == 'RealAmplitudes':
            ansatz = RealAmplitudes(
                num_qubits=num_qubits,
                reps=config.get('ansatz_reps', 1),
                entanglement=config.get('entanglement', 'full')
            )
        elif config['ansatz'] == 'EfficientSU2':
            ansatz = EfficientSU2(
                num_qubits=num_qubits,
                reps=config.get('ansatz_reps', 1),
                entanglement=config.get('entanglement', 'full')
            )
        
        # Combine feature map and ansatz
        qc = QuantumCircuit(num_qubits)
        qc.compose(feature_map, inplace=True)
        qc.compose(ansatz, inplace=True)
        
        return qc
    
    def train_model(self, X_train: np.ndarray, y_train: np.ndarray, 
                   config: Dict[str, Any], service: QiskitRuntimeService) -> Dict[str, Any]:
        """
        Train a quantum model with the given configuration.
        
        Args:
            X_train: Training features
            y_train: Training labels
            config: Model configuration
            service: QiskitRuntimeService instance
            
        Returns:
            Dictionary containing model and metrics
        """
        print(f"\nTraining model with config: {config['name']}")
        
        # Get the least busy simulator
        backend = service.least_busy(
            simulator=True,
            operational=True,
            status_msg='active',
            min_num_qubits=10
        )
        print(f"Using backend: {backend.name}")
        
        # Configure runtime options
        options = Options()
        options.optimization_level = 3
        options.resilience_level = 1
        
        # Create quantum circuit
        qc = self.get_quantum_circuit(config)
        
        # Initialize VQC
        vqc = VQC(
            feature_map=qc,
            ansatz=None,  # Already included in the circuit
            loss='cross_entropy',
            optimizer=COBYLA(maxiter=40),
            quantum_instance=backend
        )
        
        # Train the model
        with IBMSession(service=service, backend=backend) as session:
            vqc.fit(X_train, y_train)
            
            # Make predictions on training set for evaluation
            y_pred = vqc.predict(X_train)
            y_prob = vqc.predict_proba(X_train)[:, 1]
            
            # Calculate metrics
            accuracy = accuracy_score(y_train, y_pred)
            roc_auc = roc_auc_score(y_train, y_prob)
            
            print(f"Training Accuracy: {accuracy:.4f}")
            print(f"Training ROC-AUC: {roc_auc:.4f}")
            
            return {
                'model': vqc,
                'accuracy': accuracy,
                'roc_auc': roc_auc,
                'config': config,
                'backend': backend.name
            }
    
    def run_experiment(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Run the quantum model training experiment with different configurations.
        
        Args:
            X: Features
            y: Target
        """
        # Define model configurations
        configs = [
            {
                'name': 'ZZFeatureMap + RealAmplitudes (reps=1)',
                'feature_map': 'ZZFeatureMap',
                'ansatz': 'RealAmplitudes',
                'fm_reps': 1,
                'ansatz_reps': 1,
                'entanglement': 'full'
            },
            {
                'name': 'ZZFeatureMap + RealAmplitudes (reps=2)',
                'feature_map': 'ZZFeatureMap',
                'ansatz': 'RealAmplitudes',
                'fm_reps': 1,
                'ansatz_reps': 2,
                'entanglement': 'full'
            },
            {
                'name': 'ZZFeatureMap + EfficientSU2',
                'feature_map': 'ZZFeatureMap',
                'ansatz': 'EfficientSU2',
                'fm_reps': 1,
                'ansatz_reps': 1,
                'entanglement': 'full'
            },
            {
                'name': 'EfficientSU2 + RealAmplitudes',
                'feature_map': 'EfficientSU2',
                'ansatz': 'RealAmplitudes',
                'fm_reps': 1,
                'ansatz_reps': 1,
                'entanglement': 'full'
            }
        ]
        
        # Initialize Qiskit Runtime Service
        service = QiskitRuntimeService(channel='ibm_quantum')
        
        # Train models with different configurations
        for config in configs:
            result = self.train_model(X, y, config, service)
            self.results[config['name']] = result
            
            # Update best model
            if result['roc_auc'] > self.best_score:
                self.best_score = result['roc_auc']
                self.best_model = result['model']
    
    def print_results(self) -> None:
        """Print a comparison of all model results."""
        print("\n" + "="*80)
        print("MODEL COMPARISON")
        print("="*80)
        print(f"{'Model':<50} {'Accuracy':<15} {'ROC-AUC':<15} {'Backend':<15}")
        print("-"*80)
        
        for name, result in self.results.items():
            print(f"{name:<50} {result['accuracy']:<15.4f} {result['roc_auc']:<15.4f} {result['backend']:<15}")
        
        print("\nBest model:", max(self.results.items(), key=lambda x: x[1]['roc_auc'])[0])
        print("Best ROC-AUC:", self.best_score)
        
    def save_best_model(self, filename: str = 'best_model.joblib') -> None:
        """
        Save the best performing model to disk.
        
        Args:
            filename: Output filename
        """
        if self.best_model is not None:
            joblib.dump(self.best_model, filename)
            print(f"\nBest model saved to {filename}")
        else:
            print("No model to save. Please run the experiment first.")

def main():
    # Load environment variables
    load_dotenv()
    
    # Initialize the detector
    detector = QuantumFraudDetector()
    
    # Load and preprocess data
    X, y = detector.load_data(
        transaction_path=os.getenv('TRAIN_TRANSACTION_PATH', 'data/train_transaction.csv'),
        identity_path=os.getenv('TRAIN_IDENTITY_PATH', 'data/train_identity.csv'),
        sample_size=1000
    )
    
    # Prepare features
    X_pca = detector.prepare_features(X, n_components=10)
    
    # Balance the dataset
    X_balanced, y_balanced = detector.balance_data(X_pca, y)
    
    # Split data (small subset for MVP)
    X_train, X_test, y_train, y_test = train_test_split(
        X_balanced, y_balanced, test_size=0.2, random_state=SEED, stratify=y_balanced

    #  feat(preprocess)
    X_pca = detector.prepare_features(X, n_components=10)

    # feat(balance)
    X_balanced, y_balanced = detector.balance_data(X_pca, y)

    # feat(split)
    X_train, X_test, y_train, y_test = train_test_split(
        X_balanced, y_balanced, test_size=0.2, random_state=SEED, stratify=y_balanced
    )
    
    print(f"\nTraining data shape: {X_train.shape}")
    print(f"Test data shape: {X_test.shape}")
    
    # Run the experiment
    detector.run_experiment(X_train, y_train)
    
    # Print results
    detector.print_results()
    
    # Save the best model
    detector.save_best_model()

if __name__ == "__main__":
    main()
