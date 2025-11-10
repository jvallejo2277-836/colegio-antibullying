"""Runtime patches to ensure compatibility with Python 3.14 and local
environments.

This module applies small, safe monkeypatches to Django's template
context machinery when necessary so we don't have to edit files inside
virtualenv/site-packages. The patches are idempotent and minimal.

The primary change here is to expose a per-instance ``render_context``
attribute on ``BaseContext`` via a property that also provides a setter.
Some Django internals (``Context.__init__``) assign to
``self.render_context``, so the property must accept assignment. The
getter lazily creates a ``RenderContext`` per-instance.
"""

from contextlib import contextmanager

from django.template import context as template_context


def ensure_basecontext_template_attr():
    """Ensure BaseContext instances have expected attributes.

    Adds safe defaults for a few attributes and provides a
    read/write ``render_context`` property so that both code that
    expects an instance attribute (assignment) and code that expects a
    lazily-created render context (getter) work correctly.
    """
    BaseContext = getattr(template_context, "BaseContext", None)
    if BaseContext is None:
        return

    # Add simple defaults and helpers at the class level if not present.
    if not hasattr(BaseContext, "template"):
        setattr(BaseContext, "template", None)

    if not hasattr(BaseContext, "autoescape"):
        setattr(BaseContext, "autoescape", True)
    if not hasattr(BaseContext, "use_l10n"):
        setattr(BaseContext, "use_l10n", None)
    if not hasattr(BaseContext, "use_tz"):
        setattr(BaseContext, "use_tz", None)

    # Provide an `update` method on BaseContext similar to Context.update
    # so template tags that call `context.update(...)` don't fail when a
    # BaseContext-like object is used. We implement the minimal behavior
    # required by Django's template tags: push a mapping and return the
    # ContextDict object.
    if not hasattr(BaseContext, "update"):

        def _update(self, other_dict):
            if not hasattr(other_dict, "__getitem__"):
                raise TypeError(
                    "other_dict must be a mapping (dictionary-like) object."
                )
            # If a BaseContext is passed, extract its dict (compat with
            # Context.update behavior).
            if isinstance(other_dict, template_context.BaseContext):
                # Grab the last user dict if available
                try:
                    other_dict = other_dict.dicts[1:][-1]
                except Exception:
                    other_dict = {}
            return template_context.ContextDict(self, other_dict)

        setattr(BaseContext, "update", _update)

    # Provide a render_context per-instance via a property with setter so
    # assigning to `self.render_context` in subclasses (e.g.,
    # Context.__init__) works without raising AttributeError. Always (re)
    # install the property to ensure it has a setter even if some other
    # code previously added a read-only property.
    def _get_render_context(self):
        if not hasattr(self, "_render_context"):
            self._render_context = template_context.RenderContext()
        return self._render_context

    def _set_render_context(self, value):
        # Accept explicit setting of the render_context (e.g., copy)
        # and store it on the instance.
        setattr(self, "_render_context", value)

    # Install unconditionally to override any existing read-only property.
    setattr(
        BaseContext,
        "render_context",
        property(_get_render_context, _set_render_context),
    )

    # Provide a minimal bind_template context manager on BaseContext so
    # Template.render can use `with context.bind_template(template)` safely.
    if not hasattr(BaseContext, "bind_template"):

        @contextmanager
        def _bind_template(self, template):
            prev = getattr(self, "template", None)
            self.template = template
            try:
                yield
            finally:
                self.template = prev

        setattr(BaseContext, "bind_template", _bind_template)


def apply_patches():
    ensure_basecontext_template_attr()


# Execute on import
apply_patches()
