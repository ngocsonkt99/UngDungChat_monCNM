function callFindUsers(element){
    if(element.which === 13 || element.type === 'click'){
        let keyword = $("#input-find-users-contact").val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if(!keyword.length){
            alertify.notify("Chưa nhập nội dung tìm kiếm", "error", 7);
            return false;
        }

        if(!regexKeyword.test(keyword)){
            alertify.notify("Lỗi từ khóa tìm kiếm")
            return false;
        }

        $.get(`/contact/find-users/${keyword}`, function(data){
            $("#find-user ul").html(data);           
        });

    }
}

$(document).ready(function () {
    $("#input-find-users-contact").bind("keypress", callFindUsers); 

    $("#btn-find-users-contact").bind("click", callFindUsers); 
});
