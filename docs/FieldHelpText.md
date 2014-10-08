# Field Help Text

## Rules

* Should only be used in a form
* Component "FieldHelpText" should be used when multiple field tooltips are required on one form. The component will add role='tooltip' attribute to the help text in this case, and only show them when the input field has focus.
* Should a form, say with 10 fields, only require 1 or 2 help texts, then they should be visible all the time in case they might be missed by the user. In this case, always use the aria-describedby attribute on the input field, but there is no need to initialise the "FieldHelpText" Javascript component as you do not need the show/hide on focus behaviour. In this case, the help text should be above the page
* Should help text shown on form field focus comprise large amounts of text, allow the tip to run down the right hand column, even if it overlaps the starting point of a new question. The green highlight state of the field will indicate association.
