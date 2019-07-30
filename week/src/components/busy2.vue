<template>
	<div class="busy"
      :style="{
        'width':width
      }"
  >
		<div class="throbber-loader" style="margin:0 auto;margin-top:5rem;" />
    <p>努力加载中</p>
	</div>
</template>

<script>
	export default {
    name : 'busy',
    props:['width']
	}
</script>

<style scoped>
  .busy  {
    height: 100%;
    background-color: white;
  }

  @-moz-keyframes throbber-loader {
    0% {
      background: #686fbf;
    }
    10% {
      background: #f7f7f9;
    }
    40% {
      background: #686fbf;
    }
  }

  @-webkit-keyframes throbber-loader {
    0% {
      background: #686fbf;
    }
    10% {
      background: #f7f7f9;
    }
    40% {
      background: #686fbf;
    }
  }

  @keyframes throbber-loader {
    0% {
      background: #686fbf;
    }
    10% {
      background: #f7f7f9;
    }
    40% {
      background: #686fbf;
    }
  }

.throbber-loader:not(:required) {
  -moz-animation: throbber-loader 2000ms 300ms infinite ease-out;
  -webkit-animation: throbber-loader 2000ms 300ms infinite ease-out;
  animation: throbber-loader 2000ms 300ms infinite ease-out;
  background: #686fbf;
  position: relative;
  text-indent: -9999px;
  width: 0.9em;
  height: 1.5em;
  margin: 0 1.6em;
}

.throbber-loader:not(:required):before, .throbber-loader:not(:required):after {
  background: #686fbf;
  content: '\x200B';
  width: 0.9em;
  height: 1.5em;
  position: absolute;
  top: 0;
}

.throbber-loader:not(:required):before {
  -moz-animation: throbber-loader 2000ms 150ms infinite ease-out;
  -webkit-animation: throbber-loader 2000ms 150ms infinite ease-out;
  animation: throbber-loader 2000ms 150ms infinite ease-out;
  left: -1.6em;
}

.throbber-loader:not(:required):after {
  -moz-animation: throbber-loader 2000ms 450ms infinite ease-out;
  -webkit-animation: throbber-loader 2000ms 450ms infinite ease-out;
  animation: throbber-loader 2000ms 450ms infinite ease-out;
  right: -1.6em;
}

.busy p {
  font-size: 0.8rem;
  text-align: center;
  padding-top: 0.3rem;
}
</style>