/*
Copyright 2019-2022 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { CommonPage } from "../general/commom-page";
import { Constant } from "../general/constant";
import { browser, $, ExpectedConditions, element, by } from "protractor";
import { FunctionUtil } from "../utils/function-util";

export class DownloadSharePage extends CommonPage {
  DOWNLOAD_BTN = $('button[title="Download Project"]');
  DOWNLOAD_CONFIRM_BTN = $(".modal-content .btn.btn-primary");
  GENERATE_BTN = element(by.partialButtonText("GENERATE NEW DATASET"));
  DOWNLOAD_PROJECT_BTN = element(by.buttonText("DOWNLOAD"));
  LOADING_BTN = element(by.css("div.modal-footer button.uploadLoading"));
  CLOSE_BTN = $('button[class="close"]');
  MODAL_CANCEL_BTN = element(by.css("div.modal-footer button.btn-outline"));
  MODAL_OK_BTN = element(by.css("div.modal-footer button.btn-primary"));

  fs = require("fs");

  async clickdownloadProject() {
    await FunctionUtil.click(this.DOWNLOAD_BTN);
    await browser.sleep(2000);
  }

  async clickGenerateNewDataset() {
    await FunctionUtil.elementVisibilityOf(this.GENERATE_BTN);
    await FunctionUtil.click(this.GENERATE_BTN);
    await browser.wait(
      ExpectedConditions.invisibilityOf(this.LOADING_BTN),
      Constant.DEFAULT_TIME_OUT
    );
    await browser.sleep(3000);
  }

  async downloadPrject() {
    await FunctionUtil.elementVisibilityOf(this.DOWNLOAD_PROJECT_BTN);
    await FunctionUtil.click(this.DOWNLOAD_PROJECT_BTN);
    await browser.wait(
      ExpectedConditions.invisibilityOf(this.LOADING_BTN),
      Constant.DEFAULT_TIME_OUT
    );
    await browser.sleep(3000);
  }

  clickConfirmDownloadBtn() {
    return browser
      .wait(
        ExpectedConditions.visibilityOf(this.DOWNLOAD_CONFIRM_BTN),
        Constant.DEFAULT_TIME_OUT
      )
      .then(() => {
        this.DOWNLOAD_CONFIRM_BTN.click();
      });
  }

  async verifyDownloadFileExisted(filename: string, path: string) {
    await browser.sleep(3000);
    const dir = this.fs.readdirSync(path);
    console.log(`path: ${path} dir: ${dir}`);

    for await (const dirent of dir) {
      console.log(
        `dirent: ${dirent} dirent.indexOf(filename): ${dirent.indexOf(
          filename
        )}`
      );
      if (dirent.indexOf(filename) != -1) {
        return true;
      }
    }
  }

  SHARE_BTN = $('button[title="Share Datasets"]');
  async clickShareBtn() {
    return FunctionUtil.click(this.SHARE_BTN);
  }

  SHARE_INFO = element(by.id("description"));
  async inputShareInfo(info: string) {
    return FunctionUtil.sendText(this.SHARE_INFO, info);
  }

  SHARE_OK = element(by.buttonText("OK"));
  async shareProject(projectName) {
    await this.filterProjectName(projectName);
    if ((await this.verifySharedStatus()) == "folder") {
      await this.clickShareBtn();
      await FunctionUtil.elementVisibilityOf(this.MODAL_CANCEL_BTN);
      await this.MODAL_CANCEL_BTN.click();
      await this.clickShareBtn();
      await this.inputShareInfo("e2e test share project");
      await browser.sleep(5000);
      await FunctionUtil.click(this.SHARE_OK);
      await ExpectedConditions.invisibilityOf(this.MODAL_CANCEL_BTN);
    }
  }

  async unshareProject() {
    if ((await this.verifySharedStatus()) == "folder-open") {
      await this.clickShareBtn();
      await FunctionUtil.elementVisibilityOf(this.MODAL_CANCEL_BTN);
      await this.MODAL_CANCEL_BTN.click();
      await this.clickShareBtn();
      await FunctionUtil.elementVisibilityOf(this.MODAL_OK_BTN);
      await this.MODAL_OK_BTN.click();
    }
  }

  async verifySharedStatus() {
    return FunctionUtil.getAttribute(
      this.SHARE_BTN.$("clr-icon:nth-child(1)"),
      "shape"
    );
  }

  getDownloadFileName(filename: string) {
    return this.fs.readFileSync(filename, { encoding: "utf8" });
  }

  reMoveDir(dirPath) {
    try {
      var files = this.fs.readdirSync(dirPath);
    } catch (e) {
      return;
    }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + "/" + files[i];
        if (this.fs.statSync(filePath).isFile()) this.fs.unlinkSync(filePath);
        else this.reMoveDir(filePath);
      }
    this.fs.rmdirSync(dirPath);
  }

  LOG_ORIGINAL_DATASET = element(
    by.partialLinkText("download this project's original datasets")
  );

  async downloadLogOriginalDataAndClose() {
    await FunctionUtil.click(this.LOG_ORIGINAL_DATASET);
    await FunctionUtil.click(this.CLOSE_BTN);
    await browser.sleep(3000);
  }
}
