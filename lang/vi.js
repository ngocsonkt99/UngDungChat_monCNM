//Nơi lưu trữ thông báo  

export const transValidation = {
    email_incorrect:"Email phải có dạng example@gmail.com",
    password_incorrect:"Mật khẩu phải chứa ít nhất 8 kí tự bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
    password_confirmation_incorrect:"Nhập lại mật khẩu chưa chính xác",
    update_username:"Username giới hạn 3 đến 17 kí tự và không được chứa kí tự đặc biệt",
    update_gender:"Oops!",
    update_address:"Địa chỉ giới hạn trong khoảng 3-30 kí tự",
    update_phone:"Số điện thoại Việt Nam bắt đầu bằng số 0 và giới hạn trong khoảng 10-11 kí tự",
    keyword_find_user:"Lỗi tìm kiếm",
    // message_text_emoji_incorrect:"Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 kí tự"
};

export const transErrors = {
    account_in_use:"Email này đã được sử dụng",
    token_undefined:"Mã thông báo không tồn tại!",
    login_failed:"Sai tài khoản hoặc mật khẩu",
    account_not_active: "Email này đã đăng kí nhưng chưa kích hoạt tài khoản, xin vui lòng kiểm tra Email của bạn để kích hoạt tài khoản",
    account_undefined: "Tài khoản này không tồn tại",
    server_error: "Server error",
    avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg, jpeg, jpeg",
    avatar_size: "Ảnh upload tối đa cho phép là 10MB",
    user_current_password_failed:"Mật khẩu hiện tại không chính xác",
    conversation_not_found: "Cuộc trò chuyện không tồn tại",
    image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg, jpeg, jpeg",
    image_message_size: "Ảnh upload tối đa cho phép là 10MB",
    attachment_message_size: "Tệp tối đa cho phép là 10MB",
};

export const transSuccess = {
    userCreated: (userEmail)=>{
        return `Tài khoản <strong> ${userEmail}</strong> đã được tạo,
        vui lòng kiểm tra Email để kích hoạt tài khoản trước khi đăng nhập`
    },
    account_actived: "Kích hoạt tài khoản thành công bạn có thể đăng nhập vào ứng dụng",
    loginSuccess: (username)=>{
        return `hello`;
    },
    logout_success: "Đăng xuất thành công",
    user_info_updated:"Cập nhật thông tin người dùng thành công",
    user_password_updated:"Cập nhật mật khẩu thành công",
};

export const transMail = {
    subject: "Chat: Xác nhận kích hoạt tài khoản",
    template:(linkVerify)=>{
        return `
        <h2>Bạn nhận được email này vì đã đăng kí tài khoản trên ứng dụng Chat </h2>
        <h3>Vui lòng kích vào liên kết dưới để xác nhận kích hoạt tài khoản</h3>
        <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>
        `;
    },
    send_failed: "Có lỗi trong quá trình gửi email vui lòng liên hệ với chúng tôi"
};