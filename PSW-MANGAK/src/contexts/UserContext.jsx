import { createContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o objeto do usuário

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;