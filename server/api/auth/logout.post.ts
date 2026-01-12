export default defineEventHandler(async (event) => {
  deleteCookie(event, "user_id");
  return {
    success: true,
    message: "Logged out successfully",
  };
});
