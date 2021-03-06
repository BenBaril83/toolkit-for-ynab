import features from 'features';

const featureInstances = features.map(Feature => new Feature());

// This poll() function will only need to run until we find that the DOM is ready
(function poll() {
  if (typeof Em !== 'undefined' && typeof Ember !== 'undefined' &&
    typeof $ !== 'undefined' && $('.ember-view.layout').length &&
    typeof ynabToolKit !== 'undefined') {
    // Gather any desired global CSS from features
    let globalCSS = '';

    featureInstances.forEach(feature => {
      if (feature.settings.enabled && feature.injectCSS()) {
        globalCSS += `/* == Injected CSS from feature: ${feature.constructor.name} == */\n\n${feature.injectCSS()}\n`;
      }
    });

    // Inject it into the head so it's left alone
    $('head').append(
      $('<style>', { id: 'toolkit-injected-styles', type: 'text/css' }).text(
        globalCSS
      )
    );

    // And invoke any features that are ready to go.
    featureInstances.forEach((feature) => {
      if (feature.settings.enabled) {
        feature.applyListeners();

        if (feature.shouldInvoke()) feature.invoke();
      }
    });
  } else {
    setTimeout(poll, 250);
  }
}());
