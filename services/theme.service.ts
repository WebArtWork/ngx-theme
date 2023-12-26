import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Theme {
	_id: string;
	name: string;
	description: string;
	variables: Record<string, unknown>;
}

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	byModule: Record<string, Theme[]> = {};
	themes: Theme[] = [];
	_themes: any = {};

	new(): Theme {
		return {} as Theme;
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.themes = mongo.get('theme', {
			groups: 'module'
		}, (arr: any, obj: any) => {
			this.byModule = obj.module;
			this._themes = obj;
		});
	}

	create(
		theme: Theme = this.new(),
		callback = (created: Theme) => {},
		text = 'theme has been created.'
	) {
		if (theme._id) {
			this.save(theme);
		} else {
			this.mongo.create('theme', theme, (created: Theme) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(themeId: string): Theme {
		if(!this._themes[themeId]){
			this._themes[themeId] = this.mongo.fetch('theme', {
				query: {
					_id: themeId
				}
			});
		}
		return this._themes[themeId];
	}

	update(
		theme: Theme,
		callback = (created: Theme) => {},
		text = 'theme has been updated.'
	): void {
		this.mongo.afterWhile(theme, ()=> {
			this.save(theme, callback, text);
		});
	}

	save(
		theme: Theme,
		callback = (created: Theme) => {},
		text = 'theme has been updated.'
	): void {
		this.mongo.update('theme', theme, () => {
			if(text) this.alert.show({ text, unique: theme });
		});
	}

	delete(
		theme: Theme,
		callback = (created: Theme) => {},
		text = 'theme has been deleted.'
	): void {
		this.mongo.delete('theme', theme, () => {
			if(text) this.alert.show({ text });
		});
	}
}
