// ../middlewares/tenant.js
const tenantMiddleware = async (req, res, next) => {
  try {
    // Get tenant ID from request (could be from JWT, header, or subdomain)
    const tenantId = req.user.tenantId || req.headers['x-tenant-id'];
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required'
      });
    }
    
    // Get tenant from database
    const tenant = await tenantRepository.findById(tenantId);
    
    if (!tenant || !tenant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found or inactive'
      });
    }
    
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

module.exports = tenantMiddleware;