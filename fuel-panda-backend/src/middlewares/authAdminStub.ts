export const authAdminStub = (req: any, res:any, next:any) => {
  // No real auth – just attach a dummy admin
  req.admin = {
    id: "dummy-admin-id",
    role: "admin"
  };
  next();
};
