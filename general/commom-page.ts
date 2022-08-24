/*
Copyright 2019-2022 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/
import {
  $$,
  $,
  browser,
  by,
  element,
  ExpectedConditions,
  ElementFinder,
} from "protractor";
import { Constant } from "./constant";
import { async } from "q";
var fs = require("fs");
import { FunctionUtil } from "../utils/function-util";

export class CommonPage {
  PROJECT_TABLE = $(".datagrid .datagrid-table");
  PROJECT_NAME_HEADER = $('clr-dg-column[ng-reflect-field="projectName"]');
  PROJECT_NAME_FILTER_BTN = element(
    by.css("clr-dg-column:nth-child(1) clr-dg-filter:nth-child(1) button")
  );
  LOG_FILE_NAME_FILTER_BTN = element(
    by.css("clr-dg-column:nth-child(3) cds-icon[shape=filter-grid]")
  );
  LOG_FILE_NAME_FILTER_INPUT = element(
    by.css("input.filenameFilter[placeholder='Enter value here']")
  );
  PROJECT_NAME_FILTER_INPUT = $('.datagrid-filter input[name="search"]');
  CLOSE_FILTER_BTN = $('.datagrid-filter cds-icon[shape="window-close"]');
  Table_LISTS = $$(".datagrid-host .datagrid-scrolling-cells");
  FIRST_ROW_CELLS = $$(
    '.datagrid-host .datagrid-row:nth-child(2) clr-dg-cell[role="gridcell"]'
  );
  FIRST_PROJECT_NAME_CELL = $(
    '.datagrid-host .datagrid-row:nth-child(2) clr-dg-cell[role="gridcell"]:nth-of-type(1)'
  );
  GENERATE_PROJECT_BTN = $('button[title="Generate Project"]');
  PROMPT = $('span[class="alert-text"]');
  ANNOTATOR_CELL = $(
    '.datagrid-host .datagrid-row:nth-child(2) clr-dg-cell[role="gridcell"] .ng-star-inserted >div'
  );
  SHARE_DATASETS_BTN = $('button[title="Share Datasets"]');
  DATASETS_DESCRIPTION = $("#description");
  DATASETS_OK_BTN = $(
    '.modal-content button[class="btn btn-primary ng-star-inserted"]'
  );
  UPLOAD_DATASET_BTN = $(".btn-primary.add-doc");
  UPLOAD_CSV_BTN = $(".btn-primary.add-doc.float-right");
  CHOOSE_FILE_BTN = $('input[name="localFileFile"]');
  UPLOAD_CSV_OK_BTN = $(".modal-footer .btn.btn-primary");
  UPLOAD_CSV_CANCEL_BTN = $(".modal-footer .btn.btn-outline");
  CSV_UPLOAD = $("#select-basic");
  CSV_UPLOAD_OPTIONS = $$("#select-basic option");
  CSV_NAME = $(".modal-content #datasetsName");
  DELETE_PROJECT_BTN = $(
    '.datagrid-row.ng-star-inserted:last-of-type button[title="Delete Project"]'
  );
  DELETE_PROJECT_OK_BTN = $(".modal-footer .btn.btn-primary");
  DELETE_PROJECT_CANCEL_BTN = $(".modal-footer .btn.btn-outline");
  ACTIONS = $$(
    '.datagrid-host .datagrid-row:nth-child(2) clr-dg-cell[role="gridcell"] .actionClass'
  );
  DELETE_DATASET_BTN = $$('button[title="Delete Dataset"]');
  PAGE_SIZE_SELECT = element(by.css("app-dropdown-pagesize select"));
  PAGE_SIZE_SELECT_OPTION = element.all(
    by.css("app-dropdown-pagesize select option")
  );
  SHOW_ICON = element(by.css("clr-icon.showIcon"));
  HIDE_ICON = element(by.css("div.isShowHide"));
  IMG_RADIO = element(by.css("clr-radio-wrapper label[for='image']"));

  getTableLength() {
    return this.Table_LISTS.count();
  }

  async filterProjectName(name: string) {
    await FunctionUtil.click(this.PROJECT_NAME_FILTER_BTN);
    await FunctionUtil.elementVisibilityOf(this.PROJECT_NAME_FILTER_INPUT);
    await FunctionUtil.sendText(this.PROJECT_NAME_FILTER_INPUT, name);
    await FunctionUtil.click(this.CLOSE_FILTER_BTN);
  }

  async filterLogFileName(name) {
    console.log("start to filterLogFileName...", name);
    await FunctionUtil.elementVisibilityOf(this.LOG_FILE_NAME_FILTER_BTN);
    console.log("start to filterLogFileName1...", name);
    await FunctionUtil.click(this.LOG_FILE_NAME_FILTER_BTN);
    console.log("start to filterLogFileName2...", name);
    await FunctionUtil.elementVisibilityOf(this.LOG_FILE_NAME_FILTER_INPUT);
    console.log("start to filterLogFileName3...", name);
    await this.LOG_FILE_NAME_FILTER_INPUT.click();
    console.log("start to filterLogFileName4...", name);
    await this.LOG_FILE_NAME_FILTER_INPUT.sendKeys(name);
    console.log("succeed to filterLogFileName...");
  }

  getCellText(index: number) {
    return browser
      .wait(
        ExpectedConditions.visibilityOf(this.FIRST_PROJECT_NAME_CELL),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        if (index === 0) {
          return this.FIRST_PROJECT_NAME_CELL.getText();
        }
        if (index >= 1 && index <= 12) {
          return this.FIRST_ROW_CELLS.then((list) => {
            return list[index].getText();
          });
        }
      });
  }

  async clickGridFirstCell() {
    await FunctionUtil.elementVisibilityOf(this.FIRST_PROJECT_NAME_CELL);
    await this.FIRST_PROJECT_NAME_CELL.click();
  }

  getActionsCount() {
    return this.ACTIONS.count();
  }

  waitForPageLoading() {
    return browser.wait(
      ExpectedConditions.invisibilityOf($(".main-container .spinner")),
      Constant.DEFAULT_TIME_OUT
    );
  }

  waitForGridLoading() {
    return browser.wait(
      ExpectedConditions.invisibilityOf($("clr-datagrid .datagrid-spinner")),
      Constant.DEFAULT_TIME_OUT
    );
  }

  waitForLoading() {
    return browser.wait(
      ExpectedConditions.invisibilityOf($("span.spinner")),
      Constant.DEFAULT_TIME_OUT
    );
  }

  generateProject() {
    browser
      .wait(
        ExpectedConditions.visibilityOf(this.GENERATE_PROJECT_BTN),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        this.scrollToFarRight(this.PROJECT_TABLE);
        this.GENERATE_PROJECT_BTN.click();
      });
  }

  async getPromptText() {
    await FunctionUtil.elementVisibilityOf(this.PROMPT);
    return this.PROMPT.getText();
  }

  scrollToFarRight(element: ElementFinder) {
    return browser
      .wait(ExpectedConditions.visibilityOf(element), Constant.DEFAULT_TIME_OUT)
      .then(() => {
        element.scrollLeft = element.scrollWidth;
      });
  }

  scrollToBottom(element: ElementFinder) {
    return browser
      .wait(ExpectedConditions.visibilityOf(element), Constant.DEFAULT_TIME_OUT)
      .then(() => {
        element.scrollTop = element.scrollHeight;
      });
  }

  getAnnotatorCellText() {
    return browser
      .wait(
        ExpectedConditions.visibilityOf(this.ANNOTATOR_CELL),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        return this.ANNOTATOR_CELL.getText();
      })
      .then((text) => {
        return text.trim();
      });
  }

  shareDatasets() {
    return browser
      .wait(
        ExpectedConditions.visibilityOf(this.PROJECT_TABLE),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        this.PROJECT_TABLE.scrollTop = this.PROJECT_TABLE.scrollHeight;
        return browser.wait(
          ExpectedConditions.visibilityOf(this.SHARE_DATASETS_BTN),
          Constant.DEFAULT_TIME_OUT
        );
      })
      .then(() => {
        this.SHARE_DATASETS_BTN.click();
        return browser.wait(
          ExpectedConditions.visibilityOf(this.DATASETS_DESCRIPTION),
          Constant.DEFAULT_TIME_OUT
        );
      })
      .then(() => {
        this.DATASETS_DESCRIPTION.clear();
        this.DATASETS_DESCRIPTION.sendKeys("e2e test to share datasets");
        this.DATASETS_OK_BTN.click();
      })
      .then(() => {
        this.waitForShareComplete();
      });
  }

  waitForShareComplete() {
    return browser.wait(
      ExpectedConditions.invisibilityOf($(".btn.uploadLoading")),
      Constant.DEFAULT_TIME_OUT
    );
  }

  setLocalCSVPath(localCsvPath: string) {
    let path = process.cwd().replace("\\", "/") + localCsvPath;
    this.CHOOSE_FILE_BTN.sendKeys(path);
  }

  clickUploadDatasetBtn() {
    return browser
      .wait(
        ExpectedConditions.visibilityOf(this.UPLOAD_DATASET_BTN),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        this.UPLOAD_DATASET_BTN.click();
      });
  }

  async uploadCSV(csvName: string, localCsvPath: string) {
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_BTN);
    await this.UPLOAD_CSV_BTN.click();
    await this.UPLOAD_CSV_CANCEL_BTN.click();
    await this.UPLOAD_CSV_BTN.click();
    await this.CSV_NAME.clear();
    await this.CSV_NAME.sendKeys(csvName);
    await this.setLocalCSVPath(localCsvPath);
    await browser.sleep(2000);
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_OK_BTN);
    await this.UPLOAD_CSV_OK_BTN.click();
    await this.waitForUploadloading();
  }

  async uploadExistCSV(csvName: string, localCsvPath: string) {
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_BTN);
    await this.UPLOAD_CSV_BTN.click();
    await this.CSV_NAME.clear();
    await this.CSV_NAME.sendKeys(csvName);
    await this.setLocalCSVPath(localCsvPath);
    await browser.sleep(2000);
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_OK_BTN);
    await this.UPLOAD_CSV_OK_BTN.click();
    await browser.sleep(2000);
    await this.UPLOAD_CSV_CANCEL_BTN.click();
    await this.waitForUploadloading();
  }

  async uploadErrorFormatCSV(csvName: string, localCsvPath: string) {
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_BTN);
    await this.UPLOAD_CSV_BTN.click();
    await this.CSV_NAME.clear();
    await this.CSV_NAME.sendKeys(csvName);
    await this.setLocalCSVPath(localCsvPath);
    console.log("uploadErrorFormatCSV1");
    await this.IMG_RADIO.click();
    console.log("uploadErrorFormatCSV3");
    await browser.sleep(2000);
    await FunctionUtil.elementVisibilityOf(this.UPLOAD_CSV_OK_BTN);
    await this.UPLOAD_CSV_OK_BTN.click();
    await browser.sleep(2000);
    await this.UPLOAD_CSV_CANCEL_BTN.click();
    await browser.sleep(2000);
  }

  waitForUploadloading() {
    return browser.wait(
      ExpectedConditions.invisibilityOf($(".btn.uploadLoading")),
      Constant.DEFAULT_TIME_OUT
    );
  }

  async changePageValue(index) {
    console.log("start to changePageValue...");
    await FunctionUtil.elementVisibilityOf(this.PAGE_SIZE_SELECT);
    await browser.waitForAngularEnabled(false);
    await this.PAGE_SIZE_SELECT.click();
    await element
      .all(by.css("app-dropdown-pagesize select option"))
      .get(index)
      .click();
    console.log("succeed to changePageValue...");
  }

  async toShowMoreAnnotators() {
    await FunctionUtil.elementVisibilityOf(this.SHOW_ICON);
    await browser.waitForAngularEnabled(false);
    await this.SHOW_ICON.click();
  }
}
