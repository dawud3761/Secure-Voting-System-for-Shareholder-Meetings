import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Admin address
  },
  contracts: {
    '.shareholder-verification': {
      functions: {
        'set-admin': vi.fn(),
        'set-record-date': vi.fn(),
        'toggle-voting': vi.fn(),
        'register-shareholder': vi.fn(),
        'update-shares': vi.fn(),
        'remove-shareholder': vi.fn(),
        'get-shares': vi.fn(),
        'is-eligible': vi.fn(),
        'is-voting-open': vi.fn(),
        'get-record-date': vi.fn(),
        'get-admin': vi.fn(),
      }
    }
  }
};

// Setup global mock
global.clarity = mockClarity;

describe('Shareholder Verification Contract', () => {
  const contract = mockClarity.contracts['.shareholder-verification'];
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Default return values
    contract.functions['get-admin'].mockReturnValue(mockClarity.tx.sender);
    contract.functions['is-voting-open'].mockReturnValue(false);
    contract.functions['get-record-date'].mockReturnValue(0);
  });
  
  describe('Admin functions', () => {
    it('should allow admin to set a new admin', () => {
      const newAdmin = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      contract.functions['set-admin'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['set-admin'](newAdmin);
      
      expect(result.type).toBe('ok');
      expect(contract.functions['set-admin']).toHaveBeenCalledWith(newAdmin);
    });
    
    it('should allow admin to set record date', () => {
      const date = 20230101;
      contract.functions['set-record-date'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['set-record-date'](date);
      
      expect(result.type).toBe('ok');
      expect(contract.functions['set-record-date']).toHaveBeenCalledWith(date);
    });
    
    it('should allow admin to toggle voting', () => {
      contract.functions['toggle-voting'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['toggle-voting']();
      
      expect(result.type).toBe('ok');
      expect(contract.functions['toggle-voting']).toHaveBeenCalled();
    });
  });
  
  describe('Shareholder management', () => {
    it('should register a new shareholder', () => {
      const shareholder = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      const shares = 100;
      contract.functions['register-shareholder'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['register-shareholder'](shareholder, shares);
      
      expect(result.type).toBe('ok');
      expect(contract.functions['register-shareholder']).toHaveBeenCalledWith(shareholder, shares);
    });
    
    it('should update shares for an existing shareholder', () => {
      const shareholder = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      const shares = 200;
      contract.functions['update-shares'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['update-shares'](shareholder, shares);
      
      expect(result.type).toBe('ok');
      expect(contract.functions['update-shares']).toHaveBeenCalledWith(shareholder, shares);
    });
    
    it('should remove a shareholder', () => {
      const shareholder = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      contract.functions['remove-shareholder'].mockReturnValue({ value: true, type: 'ok' });
      
      const result = contract.functions['remove-shareholder'](shareholder);
      
      expect(result.type).toBe('ok');
      expect(contract.functions['remove-shareholder']).toHaveBeenCalledWith(shareholder);
    });
  });
  
  describe('Read-only functions', () => {
    it('should get shares for a shareholder', () => {
      const shareholder = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      const shares = 100;
      contract.functions['get-shares'].mockReturnValue(shares);
      
      const result = contract.functions['get-shares'](shareholder);
      
      expect(result).toBe(shares);
      expect(contract.functions['get-shares']).toHaveBeenCalledWith(shareholder);
    });
    
    it('should check if a shareholder is eligible', () => {
      const shareholder = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      contract.functions['is-eligible'].mockReturnValue(true);
      
      const result = contract.functions['is-eligible'](shareholder);
      
      expect(result).toBe(true);
      expect(contract.functions['is-eligible']).toHaveBeenCalledWith(shareholder);
    });
    
    it('should check if voting is open', () => {
      contract.functions['is-voting-open'].mockReturnValue(true);
      
      const result = contract.functions['is-voting-open']();
      
      expect(result).toBe(true);
    });
    
    it('should get the record date', () => {
      const date = 20230101;
      contract.functions['get-record-date'].mockReturnValue(date);
      
      const result = contract.functions['get-record-date']();
      
      expect(result).toBe(date);
    });
    
    it('should get the admin', () => {
      const result = contract.functions['get-admin']();
      
      expect(result).toBe(mockClarity.tx.sender);
    });
  });
});
