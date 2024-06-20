import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { ThemesComponent } from './themes.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: ThemesComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		ThemesComponent
	],
	providers: []

})

export class ThemesModule { }
