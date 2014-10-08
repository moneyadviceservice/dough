# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w(
  enhanced.css
  enhanced_fixed.css
  enhanced_responsive.css
  requirejs/require.js
  jquery/dist/jquery.js
  eventsWithPromises/src/eventsWithPromises.js
  rsvp/rsvp.js
  jqueryThrottleDebounce/jquery.ba-throttle-debounce.js
  dough/assets/js/**/*.js
)
