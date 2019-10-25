import { app } from 'electron';
import path from 'path';

export type ReplaceStrategy = (fileUrl: string) => string | undefined;
export default class {
    static get replaceStrategy(): { [key: string]: ReplaceStrategy } {
        return {
            fromExternal: (fileUrl) => {
                let result = fileUrl.replace(/%5C/gi, '\\'); // 1.6.x 버전 대응
                if (result.startsWith('./bower_components')) { // 웹 기본 오브젝트 대응
                    result = result
                        .replace(/\./, 'renderer')
                        .replace('entryjs', 'entry-js'); // 과거 웹 WS 대응
                } else if (result.indexOf('temp') > -1) { // 일반 오브젝트 대응
                    result = result.substring(result.indexOf('temp'));
                    result = path.join(this.appPath, result)
                        .replace(/\\/gi, '/');
                }
                result = result.replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응
                return result;
            },
            toExternal(fileUrl) {
                let result = fileUrl;

                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                }
                result = result.substring(result.indexOf('temp'));
                result = result.replace(/\\/gi, '/');
                result = result.replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응

                return result;
            },
            toExternalDeleteUrl(fileUrl) {
                let result: string | undefined = fileUrl;
                result = result.replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응
                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                } else {
                    result = undefined;
                }
                return result;
            },
        };
    }

    static get defaultSoundPath() {
        return [
            './bower_components/entry-js/images/media/bark.mp3',
            './bower_components/entryjs/images/media/bark.mp3',
        ];
    }

    static get defaultPicturePath() {
        return [
            './bower_components/entry-js/images/media/entrybot1.png',
            './bower_components/entryjs/images/media/entrybot1.png',
            './bower_components/entry-js/images/media/entrybot2.png',
            './bower_components/entryjs/images/media/entrybot2.png',
            './bower_components/entry-js/images/_1x1.png',
            './bower_components/entryjs/images/_1x1.png',
        ];
    }

    // 사용위치는 join 을 사용 (프로젝트 외 경로)
    static get appPath() {
        return app.getPath('userData');
    }

    static tempPathForExport(objectId: string) {
        return path.join(
            this.appPath,
            'import',
            objectId,
            path.sep,
        );
    }

    // 사용위치는 join 을 사용 (프로젝트 외 경로)
    static get tempPath() {
        return path.join(
            this.appPath,
            'temp',
            path.sep,
        );
    }

    static tempImagePath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static tempThumbnailPath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static tempSoundPath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'sound',
            path.sep,
        );
    }

    static get resourcePath() {
        return path.resolve(
            app.getAppPath(), 'src', 'renderer', 'resources', 'uploads',
        );
    }

    static resourceImagePath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static resourceThumbnailPath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static resourceSoundPath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            path.sep,
        );
    }

    static subDirectoryPath(filename: string) {
        return path.join(
            filename.substr(0, 2),
            filename.substr(2, 2),
            path.sep,
        );
    }
}
