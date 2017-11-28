## Popup Tip

### Definition
Consists of two inter-related elements wrapped in a container:
* popup_tip_trigger
* popup_tip_content

The container requires the data-dough-component value of "PopupTip" to be present so that it can use the Dough PopupTip component.

### Rules: popup_tip_trigger
* text: the text that appears in the visually hidden span that will be used by assistive technology
* classname: the optional class that is appended to the trigger

### Rules: popup_tip_content
* title: the optional text that appears at the start of the content of the pop-up as a title
* text: the textual content of the popup
* classname: the optional class that is appended to the content container
* tooltip_hide: the text that appears in the visually hidden span associated with the close icon that will be used by assistive technology

### Examples
* [Code example](https://github.com/moneyadviceservice/wpcc/blob/master/app/views/wpcc/your_details/new.html.erb)
* [Live example](https://www.moneyadviceservice.org.uk/en/tools/workplace-pension-contribution-calculator)
