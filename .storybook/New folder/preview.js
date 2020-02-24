import { addDecorator, addParameters } from "@storybook/vue";
import "font-awesome/css/font-awesome.min.css";
import "@sass/app.scss";
import "@directives/index.js";
import "@helpers/momentLocale.js";
import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";

let decoratorTemplate = () => ({
	template: `
			<div
				id="defaultView"
				class="datepicker-documentation datepicker-documentation--default"
			>	
				<story></story>
			</div>
		`
});

addDecorator(decoratorTemplate);

addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage
	}
});
