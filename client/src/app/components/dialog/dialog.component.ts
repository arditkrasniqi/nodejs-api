import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  constructor(public thisDialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string, @Inject(MAT_DIALOG_DATA) public title: string) { }
  ngOnInit() {
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }
}