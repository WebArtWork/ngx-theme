import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	ThemeService,
	Theme
} from 'src/app/modules/theme/services/theme.service';
import { AlertService, CoreService, HttpService, MongoService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { Planfeature, PlanfeatureService } from '../../plan/services/planfeature.service';

@Component({
	templateUrl: './themes.component.html',
	styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
	domain = window.location.hostname;
	columns = [
		'enabled',
		'top',
		'url',
		'name',
		'module',
		'repoPrefix'
	];

	features: Planfeature[] = [];
	form: FormInterface = this._form.getForm('theme', {
		formId: 'theme',
		title: 'Theme',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill operators title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
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
						value: ['operator', 'store', 'app']
					}
				]
			},
			{
				name: 'Select',
				key: 'features',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select features'
					},
					{
						name: 'Items',
						value: this.features
					},
					{
						name: 'Multiple',
						value: true
					}
				]
			},
			{
				name: 'Text',
				key: 'description',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill operators description'
					},
					{
						name: 'Label',
						value: 'Description'
					}
				]
			},
			{
				name: 'Text',
				key: 'repo',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill repository'
					},
					{
						name: 'Label',
						value: 'Repository'
					}
				]
			},
			{
				name: 'Text',
				key: 'branch',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill repository branch'
					},
					{
						name: 'Label',
						value: 'Repository branch'
					}
				]
			},
			{
				name: 'Photo',
				key: 'thumb',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill thumb'
					},
					{
						name: 'Label',
						value: 'Thumb'
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form
				.modal<Theme>(this.form, {
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						this._ts.create(created as Theme);
						close();
					}
				})
				.then(this._ts.create.bind(this));
		},
		update: (doc: Theme) => {
			this._form
				.modal<Theme>(this.form, [], doc)
				.then((updated: Theme) => {
					this._core.copy(updated, doc);
					this._ts.save(doc);
				});
		},
		delete: (doc: Theme) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this theme?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._ts.delete(doc);
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'sync',
				click: (doc: Theme) => {
					if (doc.repo) {
						this.sync(doc);
					} else {
						this._alert.error({
							text: 'To populate project you have to add git repository'
						});
					}
				}
			},
			{
				icon: 'cloud_download',
				click: (doc: Theme) => {
					this._form.modalUnique<Theme>('theme', 'folder', doc);
				}
			}
		]
	};

	private _sync = false;
	sync(doc: Theme) {
		if (this._sync) {
			return;
		}
		this._sync = true;
		this._http.post(
			'/api/theme/sync',
			doc,
			() => {
				this._sync = false;
				this._alert.show({
					text: 'Synchronization completed'
				});
			},
			() => {
				this._sync = false;
			}
		);
	}

	get rows(): Theme[] {
		return this._ts.themes;
	}

	update(theme: Theme) {
		this._ts.update(theme);
	}

	constructor(
		private _translate: TranslateService,
		private _pfs: PlanfeatureService,
		private _alert: AlertService,
		private _mongo: MongoService,
		private _form: FormService,
		private _core: CoreService,
		private _http: HttpService,
		private _ts: ThemeService,
	) {
		this._mongo.on('userfeature', () => {
			for (const feature of this._pfs.planfeatures) {
				this.features.push(feature);
			}
		});
	}
}
