interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    phone?: string | null;
    created_at?: string;
  };
  error?: string;
}

export const useAuth = () => {
  const isAuthenticated = ref(false);
  const user = ref<any>(null);
  const isLoading = ref(true);

  const checkAuth = async () => {
    try {
      isLoading.value = true;
      const response = await $fetch<AuthResponse>("/api/auth/me");
      if (response.success && response.user) {
        isAuthenticated.value = true;
        user.value = response.user;
      } else {
        isAuthenticated.value = false;
        user.value = null;
      }
    } catch (error) {
      isAuthenticated.value = false;
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (response.success && response.user) {
        isAuthenticated.value = true;
        user.value = response.user;
        return { success: true, user: response.user };
      }
      return { success: false, error: "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.data?.message || "Login failed" };
    }
  };

  const register = async (email: string, password: string, phone?: string) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: { email, password, phone },
      });
      if (response.success && response.user) {
        isAuthenticated.value = true;
        user.value = response.user;
        return { success: true, user: response.user };
      }
      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
      });
      isAuthenticated.value = false;
      user.value = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: "Logout failed" };
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    checkAuth,
    login,
    register,
    logout,
  };
};
