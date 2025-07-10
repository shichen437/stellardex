import bookmark from './bookmark.json';
import homepage from './homepage.json';
import notification from './notification.json';
import subscription from './subscription.json';

export default {
    ...bookmark,
    ...homepage,
    ...notification,
    ...subscription
}