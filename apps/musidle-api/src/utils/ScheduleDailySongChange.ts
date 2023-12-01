import schedule from 'node-schedule';
import songModel from '../models/SongModel';

export const scheduleSongUpdate = schedule.scheduleJob('0 0 * * *', () => {
  // find song that was in daily and set wasInDaily to false, but exclude polish songs
  songModel.findOneAndUpdate(
    { wasInDaily: false, category: { $ne: 'polish' } },
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
