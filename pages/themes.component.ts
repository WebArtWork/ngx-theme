import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { ThemeService, Theme } from 'src/app/modules/theme/services/theme.service';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';

@Component({
	templateUrl: './themes.component.html',
	styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
	columns = ['name', 'module'];

	form: FormInterface = this._form.getForm("theme", {
		formId: "theme",
		title: "Theme",
		components: [
			{
				name: "Text",
				key: "name",
				focused: true,
				fields: [
					{
						name: "Placeholder",
						value: "fill operators title",
					},
					{
						name: "Label",
						value: "Title",
					},
				],
			},
			{
				name: "Text",
				key: "description",
				fields: [
					{
						name: "Placeholder",
						value: "fill operators description",
					},
					{
						name: "Label",
						value: "Description",
					},
				],
			},
			{
				name: "Text",
				key: "domain",
				fields: [
					{
						name: "Placeholder",
						value: "fill domain",
					},
					{
						name: "Label",
						value: "Domain",
					},
				],
			},
			{
				name: 'Select',
				key: 'module',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select module'
					},
					{
						name: 'Items',
						value: ["operator", "store"]
					}
				]
			},
		],
	});

	config = {
		// create: () => {
		// 	this._form
		// 		.modal<Theme>(this.form, {
		// 			label: 'Create',
		// 			click: (created: unknown, close: () => void) => {
		// 				this._ts.create(created as Theme);
		// 				close();
		// 			}
		// 		})
		// 		.then(this._ts.create.bind(this));
		// },
		update: (doc: Theme) => {
			this._form
				.modal<Theme>(this.form, [], doc)
				.then((updated: Theme) => {
					this._core.copy(updated, doc);
					this._ts.save(doc);
				});
		},
		// delete: (doc: Theme) => {
		// 	this._alert.question({
		// 		text: this._translate.translate(
		// 			'Common.Are you sure you want to delete this theme?'
		// 		),
		// 		buttons: [
		// 			{
		// 				text: this._translate.translate('Common.No')
		// 			},
		// 			{
		// 				text: this._translate.translate('Common.Yes'),
		// 				callback: () => {
		// 					this._ts.delete(doc);
		// 				}
		// 			}
		// 		]
		// 	});
		// }
	};

	get rows(): Theme[] {
		return this._ts.themes;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService,
		private _ts: ThemeService
	) {}
}
