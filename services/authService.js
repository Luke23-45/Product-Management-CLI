// services/authService.js
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { generateId } from '../utils/idGenerator.js'; 
const USERS_FILE = '../data/users.json';
const SESSION_USER_FILE = '../data/sessionuser.json';

let sessionUser = null;

export const initializeSession = async () => {
  try {
    sessionUser = await readJSONFile(SESSION_USER_FILE);
    console.log("--------sessionUser------------", sessionUser)
    if (!sessionUser) {
      sessionUser = {}; 
      await writeJSONFile(SESSION_USER_FILE, sessionUser);
    }
  } catch (error) {
    console.error('Error initializing session:', error.message);
    sessionUser = {};
  }
};

// A hashing function
function simpleHash(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }
  return hash.toString();
}

export const login = async (username, password) => {
  try {
    const users = await readJSONFile(USERS_FILE,'u');
    if (!users) {
      throw new Error('Could not read users file');
    }
    const user = users.find((user) => String(user.username) === String(username));
    if (!user) {
      throw new Error('Invalid username or password');
    }
    if (user.password !== simpleHash(password)) {
      throw new Error('Invalid username or password');
    }
    await setSessionUser({
      userId: user.userId,
      username: user.username,
      isAdmin:user.isAdmin,
      permissions: user.permissions,
    });
    return user;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const getUserById = async (userId) =>{
  try{
    const users = await readJSONFile(USERS_FILE,'u');
    if (!users) {
      throw new Error('Could not read users file');
    }
    const user = users.find((user) => String(user.userId) === String(userId));
    if (!user) {
      throw new Error('Invalid userID');
    }
    console.log("Targetuser was found with Id", user.userId)
    return user.userId;
  }catch(err){
    throw new Error(`Could not find the user with the given ID ${userId}`)
  }

}

export const register = async (username, password, permissions) => {

  if(!permissions){
    permissions = "";
  }
  permissions = permissions.split(",").map(permission => permission.trim());
  try {
    const users = await readJSONFile(USERS_FILE,"u");
    if (!users) {
      throw new Error('Could not read users file');
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const userId = String(await generateId('u'));
    const newUser = { userId, username, password: simpleHash(password), isAdmin:false, permissions };
    users.push(newUser);
    await writeJSONFile(USERS_FILE, users);
    return newUser;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

export const getSessionUser = async () => {
  try {
    if (!sessionUser) {
      await initializeSession();
    }
    return sessionUser;
  } catch (error) {
    console.error('Error getting session user:', error.message);
    return null;
  }
};

export const setSessionUser = async (user) => {
  try {
    sessionUser = user;
    await writeJSONFile(SESSION_USER_FILE, user);
  } catch (error) {
    console.error('Error setting session user:', error.message);
  }
};
export const hasPermission = async (permission) => {
  try {
    const user = await getSessionUser();
    if (!user || Object.keys(user).length === 0) {
      return false;
    }
    console.log("Session User Permissions:", user.permissions);

    let userPermissions;
    if (Array.isArray(user.permissions)) {
      userPermissions = user.permissions.map((perm) => perm.trim());
    } else if (typeof user.permissions === 'string') {
      userPermissions = user.permissions.split(',').map((perm) => perm.trim());
    } else {
      console.warn("User permissions are in an unexpected format:", user.permissions);
      return false; 
    }

    return userPermissions && userPermissions.includes(permission);
  } catch (error) {
    
    console.error('Error checking permission:', error.message);
    return false;
  }
};

export const clearSessionUser = async () => {
  try {
    sessionUser = {};
    await writeJSONFile(SESSION_USER_FILE, sessionUser);
  } catch (error) {
    console.error('Error clearing session user:', error.message);
  }
};