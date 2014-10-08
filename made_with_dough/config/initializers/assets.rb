# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( enhanced.css )
Rails.application.config.assets.precompile += %w( enhanced_fixed.css )
Rails.application.config.assets.precompile += %w( enhanced_responsive.css )
Rails.application.config.assets.precompile += %w( requirejs/require.js )
Rails.application.config.assets.precompile += %w( jquery/dist/jquery.js )
Rails.application.config.assets.precompile += %w( eventsWithPromises/src/eventsWithPromises.js )
Rails.application.config.assets.precompile += %w( rsvp/rsvp.js )
Rails.application.config.assets.precompile += %w( jqueryThrottleDebounce/jquery.ba-throttle-debounce.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/lib/featureDetect.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/lib/mediaQueries.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/lib/componentLoader.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/lib/utilities.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/DoughBaseComponent.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/RangeInput.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/Collapsable.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/FieldHelpText.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/TabSelector.js )
Rails.application.config.assets.precompile += %w( dough/assets/js/components/Validation.js )
