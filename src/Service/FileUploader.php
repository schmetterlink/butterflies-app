<?php

namespace App\Service;

use Exception;
use Monolog\Logger;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Parameter;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\VarDumper\VarDumper;

class FileUploader
{
    const WRITE_CONTENT = 1;
    const RETURN_CONTENT = 2;

    private $uploadPath;
    private $publicPath;
    private $namingStrategy;
    private $slugger;
    private $logger;

    /**
     * FileUploader constructor.
     * @param Parameter $targetDirectory
     * @param SluggerInterface $slugger
     */
    public function __construct($uploadPath, $publicPath, $namingStrategy, SluggerInterface $slugger, LoggerInterface $logger)
    {
        $this->uploadPath = $uploadPath;
        $this->publicPath = $publicPath;
        $this->namingStrategy = $namingStrategy;
        $this->slugger = $slugger;
        $this->logger = $logger;
    }

    public function upload(UploadedFile $file)
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
        try {
            $file->move($this->getTargetDirectory(), $fileName);
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
            return null; // for example
        }
        return $fileName;
    }

    /**
     * @param Request $request
     * @param false $includeBinaryContent
     * @return array
     * @throws Exception
     */
    public function digestFormContent(Request $request, $mode = self::RETURN_CONTENT, $targetPath = null, $cleanupPath = null): array
    {
        $contentTypes = explode("; ", $request->headers->get('content-type'));
        if (in_array("multipart/form-data", $contentTypes)) {
            $this->logger->debug("multipart/form-data request detected!");
            foreach ($contentTypes as $contentType) {
                if (0 === strpos($contentType, 'boundary=')) {
                    $boundary = str_replace("boundary=", "", $contentType);
                }
            }
            $contentSegments = explode($boundary, $request->getContent());
            $contentSegments = array_splice($contentSegments, 1, -1);

            $parsedContent = [];

            foreach ($contentSegments as $contentSegment) {
                $rows = array_filter(preg_split("(\n\r|\n|\r)", $contentSegment));
                $headers = implode("; ", $rows) . ";";
                preg_match_all('/[;^]?(Content-Type|Content-Disposition|filename|name)[:=] ?"?(.*?)"?[;$]/', $headers, $matches, PREG_SET_ORDER);
                $attributes = [];
                foreach ($matches as $match) {
                    if (!isset($attributes[$match[1]])) {
                        $attributes[$match[1]] = $match[2];
                    }
                }
                $content = explode("\r\n\r\n", $contentSegment);
                array_shift($content);
                if (isset($attributes['filename']) && isset($attributes['Content-Type'])) {
                    $content = implode("\r\n\r\n", $content);
                    $filename = $attributes['filename'];

                    //$publicPath = $this->getPath($this->getPublicDirectory(), $uploadPath ,$filename);
                    //$targetPath = $this->getPath($this->getTargetDirectory(), $uploadPath ,$filename);
                    $fileParams = pathinfo($filename);
                    $fileParams['path'] = $this->uploadPath;
                    $fileParams['upload'] = $this->uploadPath;
                    $fileParams['fieldname'] = $attributes['name'];

                    if ($targetPath) {
                        $uploadPath = $this->pathTemplate($targetPath, $fileParams);
                    } else {
                        $uploadPath = $this->pathTemplate($this->namingStrategy, $fileParams);
                    }

                    $fileParams['path'] = $this->publicPath;
                    $fileParams['public'] = $this->publicPath;

                    if ($targetPath) {
                        $publicPath = $this->pathTemplate($targetPath, $fileParams);
                    } else {
                        $publicPath = $this->pathTemplate($this->namingStrategy, $fileParams);
                    }

                    $attributes['public'] = $publicPath;
                    $attributes['upload'] = $uploadPath;

                    if ($mode & self::WRITE_CONTENT) {
                        $attributes['content'] = $publicPath;
                        $dir = pathinfo($uploadPath, PATHINFO_DIRNAME);
                        if (!file_exists($dir)) {
                            mkdir($dir, 0755, true);
                        }
                        if ($cleanupPath) {
                            $cleanupPath = $this->pathTemplate($cleanupPath, $fileParams);
                            $this->logger->info("performing cleanup ('" . $cleanupPath . "')");
                            $glob = glob($cleanupPath);
                            foreach ($glob as $row) {
                                $this->logger->info("unlinking existing file {file}", ["file" => $row]);
                                unlink($row);
                            }
                            // array_map("unlink", $glob);
                        }
                        file_put_contents($uploadPath, $content);
                    }

                    if ($mode & self::RETURN_CONTENT) {
                        $attributes['content'] = $content;
                    }
                } else {
                    preg_match("/\r\n(.*?)\r\n--/", $contentSegment, $matches);
                    $attributes['content'] = $matches[1];
                }
                $parsedContent[] = $attributes;
            }
            return $parsedContent;
        }
        throw new Exception('FileUploader only accepts multipart/form-data encoded content');
    }

    public function pathTemplate($template, $replacements)
    {
        return preg_replace_callback('/{(.+?)}/',
            function ($matches) use ($replacements) {
                return $replacements[$matches[1]];
            }, $template);
    }

    public function getTargetDirectory(): string
    {
        return $this->uploadPath;
    }

    public function getPublicDirectory(): string
    {
        return $this->uploadPath;
    }
}