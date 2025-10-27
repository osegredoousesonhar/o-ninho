import React, { useState } from 'react'; // 1. Importamos o 'useState' para criar "memórias"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // 2. Importamos as ferramentas de autenticação do Firebase
import app from '../firebaseConfig.js'; // 3. Importamos nossa configuração do Firebase

function Login() {
  // 4. Criamos "memórias" (estados) para guardar o e-mail e a senha que o usuário digita
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 5. Esta é a função que será executada quando o botão for clicado
  const handleLogin = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido!
        const user = userCredential.user;
        alert("Login realizado com sucesso! Bem-vindo, " + user.email); // Usamos um 'alert' simples por enquanto
      })
      .catch((error) => {
        // Ocorreu um erro!
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Erro ao fazer login: " + errorMessage); // Mostramos a mensagem de erro
      });
  };

  return (
    <div>
      <h2>Acesso ao Painel</h2>
      {/* 6. Conectamos as "memórias" aos campos de input */}
      <input 
        type="email" 
        placeholder="Seu e-mail" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <br />
      <input 
        type="password" 
        placeholder="Sua senha" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <br />
      {/* 7. Conectamos nossa função ao botão */}
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;