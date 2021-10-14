import cron from "cron";
import moment from "moment";
import _ from "lodash";

import FlashSale from "../models/flashSale.model";
import User from "../models/user.model";
import { sendEmail } from "./sendMail";

export const sendMailCron = async () => {
  const flashSales = await FlashSale.find().select(
    "name productId discountPercent timeStart timeEnd"
  );
  // console.log(flashSales);
  const users = await User.find()
    .select({ isAdmin: false })
    .select("username email phone");
  // console.log(users);

  flashSales.map(async (item) => {
    const timeStart = moment(item.timeStart).subtract(15, "minutes");

    const minute = timeStart.minute();
    const hour = timeStart.hour();
    const date = timeStart.date();
    const month = timeStart.month();
    const year = timeStart.year();

    const cronTime = `00 ${minute} ${hour} ${date} ${month} * `;

    // check year
    if (moment().year() === year) {
      const job = new cron.CronJob({
        cronTime,
        onTick: function () {
          console.log("-----------------------cronjob-----------------------");
          let baseURL = [];
          item.productId.map(async (id) => {
            let URL = `${process.env.BASE_URL}:${process.env.PORT}/api/product/${id}`;
            baseURL.push(URL);
          });

          users.map(async (user) => {
            const htmlTemplate = `
            Hi, ${user.username}!
            Flash Sale will start in 15 minutes(${hour}:${minute}:00 ${month}-${date}-${year})
            Disount: ${item.discountPercent}%
            Please click here:
        ${_.join(baseURL, "\n\t")}
            `;
            sendEmail(user.email, `Flash Sale ${item.name}`, htmlTemplate);
          });
        },
        start: true,
        timeZone: "Asia/Ho_Chi_Minh",
      });
      job.start();
    }
  });
};
