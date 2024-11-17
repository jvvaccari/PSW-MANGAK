export default {
    testEnvironment: "jsdom", // Define o ambiente do navegador para testes
    transform: {
      "^.+\\.jsx?$": "babel-jest" // Informa ao Jest para transformar arquivos JSX/JS com Babel
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy" // Permite ignorar arquivos CSS
    },
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)", // Encontra arquivos de teste
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ]
  };  