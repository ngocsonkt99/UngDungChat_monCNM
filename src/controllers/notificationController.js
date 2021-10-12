import {notification} from"./../services/index";

let markAllAsRead =async (req, res) => {
    try {
       let mark = await notification.markAllAsRead(req.user._id, req.body.targetUsers);
        return res.status(200).send(mark);

    }catch (error) {
        return res.status(500).send(error.message)
    }
};

module.exports = {
    markAllAsRead: markAllAsRead,
}