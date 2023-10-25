import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';

import {StepsModule} from 'primeng/steps';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PanelModule} from 'primeng/panel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressBarModule} from 'primeng/progressbar';
import {SkeletonModule} from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import {Messages, MessagesModule} from 'primeng/messages';
import {TabMenuModule} from 'primeng/tabmenu';

@NgModule({
  declarations: [],
  imports:[
    CommonModule
  ],
 exports: [
  InputTextModule,
  SidebarModule,
  ButtonModule,
  TableModule,
  DialogModule,
  StepsModule,
  ToastModule,
  DropdownModule,
  InputTextareaModule,
  PanelModule,
  ConfirmDialogModule,
  InputSwitchModule,
  RadioButtonModule,
  TooltipModule,
  ProgressBarModule,
  SkeletonModule,
  ChartModule,
  MessagesModule,
  TabMenuModule,
 ],
 providers:[ConfirmationService,MessageService]
})
export class PrimeModule { }
