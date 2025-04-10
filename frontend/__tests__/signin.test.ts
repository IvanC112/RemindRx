import { signin } from '@/app/(auth)/signin/actions'; 
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
  

describe('signin function', () => {

  const mockFormData = new FormData();
  const mockState = {};
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFormData.set('email', 'test123@test.com');
    mockFormData.set('password', 'test123');
  });

  it('should sign in successfully with valid credentials', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });

    await signin(mockState, mockFormData);

    expect(createClient).toHaveBeenCalled();
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test123@test.com',
      password: 'test123',
    });

    const result = await signin(mockState, mockFormData);
    expect(result).toEqual({ success: true });    
  });



  it('should handle authentication errors when password is incorrect', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();


    const mockError = { message: 'Invalid login credentials', status: 400 };
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: mockError });
    
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });

    const incorrectPasswordForm = new FormData();
    incorrectPasswordForm.set('email', 'test123@test.com');
    incorrectPasswordForm.set('password', 'wrongPassword');

    try {
      await signin(mockState, incorrectPasswordForm);

      fail('Expected redirect to throw an error but it did not');
    } catch (error) {
      expect(mockConsoleError).toHaveBeenCalledWith(mockError);
      
      expect(createClient).toHaveBeenCalled();
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test123@test.com',
        password: 'wrongPassword',
      });
    }

    mockConsoleError.mockRestore();
  });
});
