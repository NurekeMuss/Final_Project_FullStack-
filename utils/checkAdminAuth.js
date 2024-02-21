
export default(req, res, next) => {
    // Assuming you have stored the user's role in the request object after authentication
    const userRole = req.user.role;

    // Check if the user is an admin
    if (userRole !== 'admin') {
        // If not an admin, send a 403 Forbidden status and an error message
        return res.status(403).json({ message: 'Unauthorized access. Admin permission required.' });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
};
