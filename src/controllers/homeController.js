let getHome = (req, res) => {
    return res.render("main/home/home", {
       errors: req.flash("error"),
       success: req.flash("success") ,
       user: req.user
    });
  };

  module.exports = {
      getHome: getHome,
  };