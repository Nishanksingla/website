
    function showForgotForm() {
        $('.loginBox').fadeOut('fast', function () {
            $('.forgotBox').fadeIn('fast');
            $('.login-footer').fadeOut('fast', function () {
                $('.forgot-footer').fadeIn('fast');
            });
            $('.modal-title').html('Forgot Password');
        }); $('.error').removeClass('alert alert-danger').html('');
    }
    function showLoginForm() {
        $('#loginModal .forgotBox').fadeOut('fast', function () {
            $('.loginBox').fadeIn('fast');
            $('.forgot-footer').fadeOut('fast', function () {
                $('.login-footer').fadeIn('fast');
            });
            $('.modal-title').html('Login to Food Co-Packaging');
        });
        $('.error').removeClass('alert alert-danger').html('');
    }
    function openLoginModal() {
        showLoginForm();
        setTimeout(function () {
            $('#loginModal').modal('show');
        }, 230);
    }
    function openRegisterModal() {
        showRegisterForm();
        setTimeout(function () {
            $('#loginModal').modal('show');
        }, 230);
    }
    function loginAjax() {
        shakeModal();
    }
    function shakeModal() {
        $('#loginModal .modal-dialog').addClass('shake');
        $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
        $('input[type="password"]').val('');
        setTimeout(function () {
            $('#loginModal .modal-dialog').removeClass('shake');
        }, 1000);
    }
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
        $('.loginBox').show();
        $('.login-footer').show();
        $('.forgotBox').hide();
        $('.forgot-footer').hide();
        $('#loginform')[0].reset();
        $('#forgotPassword')[0].reset();
        $('.modal-title').text('Login to Food Co-Packaging');
    });
