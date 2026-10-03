const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez del token JWT enviado en los headers.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  // Soporta formato 'Bearer <TOKEN>' o el token directamente
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const secretKey = process.env.JWT_SECRET || 'secret_key_inventario';
    const decodedPayload = jwt.verify(token, secretKey);
    
    // Almacena los datos del usuario (id, role, etc.) en el objeto request
    req.user = decodedPayload;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Acceso denegado. Token inválido o expirado.' });
  }
};

/**
 * Middleware para controlar el acceso basado en roles (RBAC).
 * @param {Array<string>} roles - Lista de roles permitidos para la ruta.
 */
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Acceso prohibido. Rol de usuario no identificado.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acceso prohibido. No posees los permisos necesarios para realizar esta acción.' 
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
};