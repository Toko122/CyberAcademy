/**
 * The academy's fixed public location. Keep every map and address display
 * pointed here rather than deriving a visitor's location at runtime.
 */
export const ACADEMY_LOCATION = {
  address: 'დემეტრე თავდადებულის 49',
  city: 'ბათუმი',
  country: 'საქართველო',
  latitude: 41.64192,
  longitude: 41.64328,
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=41.64192,41.64328&z=17&ie=UTF8&iwloc=&output=embed',
} as const;
