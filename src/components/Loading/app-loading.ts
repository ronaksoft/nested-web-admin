export default {
  hide: function() {
    const loading = document.querySelector('.loading-container');
    const style = document.querySelector('#initial-loading-style');
    if (loading) {
      loading.classList.add('disappear-loading');
      setTimeout(() => {
        loading.remove();
        if (style) {
          style.remove();
        }
      }, 2100);
    }
  },
};
