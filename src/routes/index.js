import { validateUsernameAndPassword, validateImageurl, validatePatchAndDocument } from '../middlewares/validators';
import { authenticate, generateThumbnail, applyJsonPatch } from '../controllers';
import checkUserIsAuthenticated from '../middlewares/checkUserIsAuthenticated';

export default (router) => {
  router.post('/api/v1/auth', validateUsernameAndPassword, authenticate);
  router.post('/api/v1/thumbnail', checkUserIsAuthenticated, validateImageurl, generateThumbnail);
  router.patch('/api/v1/patch', checkUserIsAuthenticated, validatePatchAndDocument, applyJsonPatch);
};
