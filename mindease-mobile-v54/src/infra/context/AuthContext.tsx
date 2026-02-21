import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";
import { auth } from "../../firebaseConfig";
import { ProfileController } from "../../presentation/ProfileController";
import { UserController } from "../../presentation/UserController";
import { showToast } from "../../shared/toastService";

// Try to load react-native-toast-message if available, otherwise fall back to Alert
let Toast: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Toast = require("react-native-toast-message");
} catch (e) {
  Toast = null;
}

interface Profile {
  id: string;
  email?: string | null;
  displayName?: string | null;
}

interface IAuthContext {
  user: UserCredential | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    password: string,
  ) => Promise<UserCredential | void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      // tenta buscar perfil completo no Realtime DB via UserController
      try {
        const userController = new UserController();
        const profileFromDb = await userController.getUserById(
          userCredential.user.uid,
        );

        if (profileFromDb) {
          const mapped: Profile = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            displayName:
              profileFromDb.nome ?? userCredential.user.displayName ?? null,
          };
          // inclui campos adicionais se existirem
          (mapped as any).saldo = profileFromDb.saldo;
          (mapped as any).stylePreferences = profileFromDb.stylePreferences;
          setProfile(mapped);
        } else {
          setProfile({
            id: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName ?? null,
          });
        }

        setUser(userCredential);
      } catch (e) {
        console.error("Erro ao buscar perfil do usuário:", e);
        setUser(userCredential);
        setProfile({
          id: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName ?? null,
        });
      }
      setIsAuthenticated(true);
      console.info("Usuário logado com sucesso!");
      try {
        showToast({ message: "Login efetuado com sucesso", type: "success" });
      } catch {}
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      try {
        showToast({ message: "Erro ao autenticar usuário", type: "error" });
      } catch {}
      return false;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password,
      );
      // opcional: armazenar `response`/perfil localmente
      setUser(response);
      setProfile({ id: response.user.uid, email: response.user.email });

      // cria profile no Realtime DB usando ProfileController se um nome for fornecido
      try {
        const profileController = new ProfileController();
        const profilePayload: any = {
          id: response.user.uid,
          userName: response.user.displayName || null,
          dataCriacao: new Date(),
          stylePreferences: {},
        };
        await profileController.createProfile(profilePayload);
      } catch (e) {
        console.warn("Falha ao criar profile no DB:", e);
      }
      console.info("Usuário cadastrado com sucesso!");
      try {
        showToast({
          message: "Cadastro realizado com sucesso",
          type: "success",
        });
      } catch {}
      return response;
    } catch (error) {
      try {
        showToast({ message: "Erro ao cadastrar usuário.", type: "error" });
      } catch {}
      Alert.alert("Erro", "Erro ao cadastrar usuário.");
      console.error("Erro ao cadastrar usuário", error);
      return;
    }
  };

  const logout = () => {
    auth.signOut();
    console.log("Logout chamado, usuário deslogado com sucesso");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        profile,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "Contexto não encontrado, useAuth deve estar dentro de AuthProvider",
    );
  }

  return context;
};

export const ReauthenticateUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    if (!auth.currentUser) return false;

    const credentials = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser, credentials);

    // Se não lançar erro, a senha está correta
    return true;
  } catch (error) {
    try {
      showToast({
        message: "Senha incorreta ou erro na autenticação.",
        type: "error",
      });
    } catch {}
    Alert.alert("Erro", "Senha incorreta ou erro na autenticação.");
    return false;
  }
};
