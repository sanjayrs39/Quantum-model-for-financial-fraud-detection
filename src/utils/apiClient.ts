/**
 * Quantum Fraud Detection API Client
 * Connects React frontend to Python FastAPI backend
 */

// API Base URL - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Types
export interface TransactionInput {
  TransactionAmt: number;
  ProductCD?: string;
  card1?: number;
  card2?: number;
  card4?: string;
  card6?: string;
  addr1?: number;
  dist1?: number;
  P_emaildomain?: string;
  R_emaildomain?: string;
  TransactionDT?: number;
}

export interface FraudPrediction {
  fraud_probability: number;
  is_fraud: boolean;
  risk_level: string;
  threshold_used: number;
  model_used: string;
}

export interface HealthStatus {
  status: string;
  models_loaded: string[];
  pipeline_loaded: boolean;
}

export interface ModelMetrics {
  [key: string]: {
    roc_auc?: number;
    f1_score?: number;
    precision?: number;
    recall?: number;
    accuracy?: number;
    training_time?: number;
  };
}

// API Functions
export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'offline',
      models_loaded: [],
      pipeline_loaded: false
    };
  }
};

export const getMetrics = async (): Promise<ModelMetrics> => {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    const data = await response.json();
    return data.models || {};
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return {};
  }
};

export const predictFraud = async (transaction: TransactionInput): Promise<FraudPrediction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Prediction failed:', error);
    return {
      fraud_probability: 0,
      is_fraud: false,
      risk_level: 'Error',
      threshold_used: 0.5,
      model_used: 'error'
    };
  }
};

export const predictBatch = async (transactions: TransactionInput[]): Promise<FraudPrediction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Batch prediction failed:', error);
    return [];
  }
};

export const listModels = async (): Promise<{ models: string[]; thresholds: Record<string, number> }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    return await response.json();
  } catch (error) {
    console.error('Failed to list models:', error);
    return { models: [], thresholds: {} };
  }
};

// Utility function to generate mock transaction for testing
export const generateMockTransaction = (): TransactionInput => {
  const cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
  const cardCategories = ['credit', 'debit'];
  const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'hotmail.com'];
  const productCodes = ['W', 'C', 'R', 'H', 'S'];
  
  return {
    TransactionAmt: Math.random() * 10000 + 10,
    ProductCD: productCodes[Math.floor(Math.random() * productCodes.length)],
    card1: Math.floor(Math.random() * 10000) + 1000,
    card2: Math.floor(Math.random() * 700) + 100,
    card4: cardTypes[Math.floor(Math.random() * cardTypes.length)],
    card6: cardCategories[Math.floor(Math.random() * cardCategories.length)],
    addr1: Math.floor(Math.random() * 500) + 100,
    dist1: Math.random() * 500,
    P_emaildomain: emailDomains[Math.floor(Math.random() * emailDomains.length)],
    R_emaildomain: Math.random() > 0.5 ? emailDomains[Math.floor(Math.random() * emailDomains.length)] : undefined,
    TransactionDT: Math.floor(Math.random() * 86400 * 30),
  };
};
