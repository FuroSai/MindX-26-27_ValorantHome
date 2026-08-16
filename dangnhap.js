// Nếu đã đăng nhập rồi → chuyển thẳng về trang chủ
        if (Auth.isLoggedIn()) {
            window.location.href = 'main.html';
        }

        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const result = Auth.login(username, email, password);
            showAlert(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                setTimeout(() => { window.location.href = 'main.html'; }, 800);
            }
        });

        function showAlert(msg, type) {
            const el = document.getElementById('alertMsg');
            el.textContent = msg;
            el.className = 'alert-msg ' + (type === 'success' ? 'alert-success' : 'alert-error');
            el.style.display = 'block';
        }