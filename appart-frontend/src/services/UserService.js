/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

class UserService {
  
  /**
   * Get data from form
   *
   * @param form
   * @param is_staff
   * @param is_active
   * @return {FormData}
   */
  static getFormData(form, is_staff, is_active) {
    const userFormData = new FormData(form);
    userFormData.delete('is_staff');
    userFormData.delete('is_active');
    userFormData.append('is_staff', is_staff);
    userFormData.append('is_active', is_active);
    return userFormData;
  }
}

export default UserService;