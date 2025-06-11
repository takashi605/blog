{{/*
チャート名の取得
Chart.yaml の中の name を取得するが、Value.yaml の中に nameOverride がある場合はそちらを優先する
63文字で切り捨てを行い、末尾に - が残ってしまった場合に備えて - を削除している
*/}}
{{- define "blog-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
完全修飾アプリ名(クラスタ内で一意の名前)の取得
取得されるものは以下の3パターン
1. .Values.fullnameOverride
2. .Release.Name
3. .Release.Name-.Chart.Name
*/}}
{{- define "blog-chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
「チャート名-バージョン値」の文字列を取得
セマンティックバージョニングには +build のようなメタデータが含まれることがあるため、
+ を _ に変換して Kubernetes のリソース名として使用できるようにしている
*/}}
{{- define "blog-chart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
汎用ラベルの生成
*/}}
{{- define "blog-chart.labels" -}}
helm.sh/chart: {{ include "blog-chart.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: {{ include "blog-chart.fullname" . }}
{{- end }}

{{/*
ラベルセレクタの生成
*/}}
{{- define "blog-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "blog-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
サービスアカウント名の取得
*/}}
{{- define "blog-chart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "blog-chart.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- /*
アプリケーション「web」の名前を取得
*/ -}}
{{- define "web.appname" -}}
{{- "web" }}
{{- end }}

{{- /*
アプリケーション「admin」の名前を取得
*/ -}}
{{- define "admin.appname" -}}
{{- "admin" }}
{{- end }}

{{- /*
アプリケーション「e2e」の名前を取得
*/ -}}
{{- define "e2e.appname" -}}
{{- "e2e" }}
{{- end }}

{{- /*
アプリケーション「api」の名前を取得
*/ -}}
{{- define "api.appname" -}}
{{- "api" }}
{{- end }}

{{- /*
アプリケーション「api_v2」の名前を取得
*/ -}}
{{- define "api_v2.appname" -}}
{{- "api-v2" }}
{{- end }}

{{- /*
アプリケーション「postgres」の名前を取得
*/ -}}
{{- define "postgres.appname" -}}
{{- "postgres" }}
{{- end }}
{{- /*

アプリケーション「postgres」に関連するシークレットの名前を取得
*/ -}}
{{- define "postgres.secret.name" -}}
{{- "postgres" }}
{{- end }}
