import { User, PlanId, UserProfileData, ImageFile } from '../types';

// In a real app, this would be an environment variable.
const BUBBLE_API_URL = 'https://fitonme-app.bubbleapps.io/version-test/api/1.1/wf';
const AUTH_TOKEN_KEY = 'fitonme_auth_token';

// --- Token Management ---
const getAuthToken = (): string | null => {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
        return null;
    }
};

const setAuthToken = (token: string): void => {
    try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
        console.error("Failed to save auth token to localStorage", e);
    }
};

const removeAuthToken = (): void => {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
        console.error("Failed to remove auth token from localStorage", e);
    }
};


// --- Generic API Fetcher ---
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    // FIX: Spreading `options.headers` is not type-safe because `HeadersInit` can be `string[][]`.
    // This normalizes `options.headers` into a `Headers` object, then converts it back to a
    // plain object to be safely spread, which resolves the TypeScript error.
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...Object.fromEntries(new Headers(options.headers)),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BUBBLE_API_URL}/${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            const responseBody = await response.json();
            errorData = responseBody.message || `Error ${response.status}: ${response.statusText}`;
        } catch (e) {
            errorData = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorData);
    }

    // Handle responses with no content (e.g., a 204 from a successful logout)
    if (response.status === 204) {
        return null;
    }

    // Bubble often wraps responses in a "response" object
    const data = await response.json();
    return data.response || data;
};


// --- Auth ---
export const signUp = async (email: string, password: string): Promise<User> => {
    const data = await apiFetch('auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (data.token) {
        setAuthToken(data.token);
    }
    return data.user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
    const data = await apiFetch('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (data.token) {
        setAuthToken(data.token);
    }
    return data.user;
};

export const signOut = async (): Promise<void> => {
    // Optionally call a Bubble endpoint to invalidate the token on the backend
    // await apiFetch('auth/logout', { method: 'POST' });
    removeAuthToken();
};


// --- User Profile ---
export const getCurrentUser = async (): Promise<User | null> => {
    if (!getAuthToken()) {
        return null;
    }
    try {
        // Bubble might return user data directly or nested. Adjust as needed.
        const data = await apiFetch('user/profile');
        return data.user as User;
    } catch (error) {
        console.error("Failed to fetch current user, token might be invalid.", error);
        removeAuthToken(); // Clean up invalid token
        return null;
    }
};

export const updateUserProfile = async (profileData: UserProfileData): Promise<User> => {
    const data = await apiFetch('user/profile', {
        method: 'POST', // Or PATCH/PUT depending on Bubble endpoint config
        body: JSON.stringify(profileData),
    });
    return data.user;
};


// --- Image Generation ---
const prepareImageForBackend = (imageFile: ImageFile) => ({
    file_name: imageFile.file.name,
    file_content: imageFile.base64, // Send base64 content
});

export const generateImage = async (personImage: ImageFile, clothingImage: ImageFile): Promise<{ imageUrl: string }> => {
    return apiFetch('generations/create', {
        method: 'POST',
        body: JSON.stringify({
            personImage: prepareImageForBackend(personImage),
            clothingImage: prepareImageForBackend(clothingImage),
        }),
    });
};

export const editImage = async (baseImage: ImageFile, prompt: string): Promise<{ imageUrl:string }> => {
    return apiFetch('generations/edit', {
        method: 'POST',
        body: JSON.stringify({
            baseImage: prepareImageForBackend(baseImage),
            prompt,
        }),
    });
};


// --- Billing ---
export const purchaseCredits = async (planId: PlanId): Promise<User> => {
    const data = await apiFetch('billing/purchase', {
        method: 'POST',
        body: JSON.stringify({ planId }),
    });
    return data.user;
};


// --- Render History Management (Frontend Only) ---
const RENDER_HISTORY_KEY = 'fitonme_render_history';
const MAX_HISTORY_ITEMS = 10;

export const getRenderHistory = (): string[] => {
    try {
        const storedHistory = localStorage.getItem(RENDER_HISTORY_KEY);
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
        console.error("Could not read history from localStorage:", error);
        return [];
    }
};

export const addRenderToHistory = (newImage: string): string[] => {
    try {
        let history = getRenderHistory();
        // Avoid adding duplicates
        if (history.includes(newImage)) return history;
        
        history.unshift(newImage);
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }
        localStorage.setItem(RENDER_HISTORY_KEY, JSON.stringify(history));
        return history;
    } catch (error) {
        console.error("Could not save history to localStorage:", error);
        return getRenderHistory();
    }
};

export const removeRenderFromHistory = (imageToRemove: string): string[] => {
    try {
        let history = getRenderHistory();
        const newHistory = history.filter(image => image !== imageToRemove);
        localStorage.setItem(RENDER_HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
    } catch (error) {
        console.error("Could not remove item from history:", error);
        return getRenderHistory();
    }
};