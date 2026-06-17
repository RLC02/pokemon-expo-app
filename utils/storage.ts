import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_KEY = '@pokemon_logged_in_user';
const UID_KEY = '@pokemon_uid';

export async function getLoginSession(): Promise<{ userId: string; username: string } | null> {
  try {
    const rawData = await AsyncStorage.getItem(LOGIN_KEY);
    if (!rawData) return null;

    // Se for o formato antigo (JSON com as duas infos juntas)
    if (rawData.startsWith('{')) {
      const parsed = JSON.parse(rawData);
      // Migra para o formato novo para limpar a chave antiga
      if (parsed.userId && parsed.username) {
        await saveLoginSession(parsed);
      }
      return parsed;
    }

    // Novo formato: LOGIN_KEY contém apenas o nome
    const userId = await AsyncStorage.getItem(UID_KEY);
    if (userId) {
      return { username: rawData, userId };
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function saveLoginSession(session: { userId: string; username: string }): Promise<void> {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, session.username); // Salva somente o nome!
    await AsyncStorage.setItem(UID_KEY, session.userId);     // O ID longo vai para uma chave separada
  } catch (e) {
    console.error(e);
  }
}

export async function clearLoginSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOGIN_KEY);
    await AsyncStorage.removeItem(UID_KEY);
  } catch (e) {
    console.error(e);
  }
}
