import schedule from 'node-schedule';
import songModel from '../models/SongModel';

export const scheduleSongUpdate = schedule.scheduleJob('0 0 * * *', () => {
  songModel.findOneAndUpdate(
    { wasInDaily: false },
    { wasInDaily: true },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log('Something wrong when updating data!');
      }
      console.log(doc);
    },
  );
});
