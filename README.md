# Tính Calo Giảm Cân

Mở `index.html` bằng trình duyệt là dùng được, không cần cài đặt hay đăng nhập. Dữ liệu lưu trong trình duyệt (localStorage).

- Nhập cân nặng, số kg muốn giảm, số ngày -> calo và protein nên ăn mỗi ngày
- Cân hằng ngày -> biểu đồ thực tế vs kế hoạch, calo mục tiêu tự tính lại theo cân mới
- Ghi món đã ăn theo bữa: `100g cơm`, `2 chén cơm`, `1 tô phở`, `2 quả trứng`, `1 lon bia`; chép bữa từ ngày trước
- Gần 230 món Việt có sẵn trong `foods.js` (sửa tay được)
- Món chưa có: AI (Claude) ước lượng rồi tự thêm vào danh sách — cần API key, nhập ở mục 8
- Ghi buổi tập -> cộng calo đốt vào phần còn được ăn
- Lịch sử 14 ngày, xem/sửa lại ngày cũ
- Tick món mua/ăn được -> thực đơn 7 ngày, gợi ý món dễ mua, danh sách đi chợ
- Sao lưu / khôi phục dữ liệu ra file JSON (không chứa API key)

Test: `node test.js`
