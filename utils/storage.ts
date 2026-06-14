import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_KEY = '@pokemon_logged_in_user';

export async function getLoginSession(): Promise<{ userId: string; username: string } | null> {
  try {
    const data = await AsyncStorage.getItem(LOGIN_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function saveLoginSession(session: { userId: string; username: string }): Promise<void> {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(session));
  } catch (e) {
    console.error(e);
  }
}

export async function clearLoginSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOGIN_KEY);
  } catch (e) {
    console.error(e);
  }
}
