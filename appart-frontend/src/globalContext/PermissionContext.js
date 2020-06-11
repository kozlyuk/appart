/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';

export const PermissionContext = React.createContext({});
export const PermissionProvider = PermissionContext.Provider;
export const PermissionConsumer = PermissionContext.Consumer;