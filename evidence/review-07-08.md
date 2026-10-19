# 第7、8章与学习方法独立内容复审

审查者：course_reliability，未参与 `ch07.json`、`ch08.json`、`method.json` 的写作和修改；也未参与本轮4张机制图设计和修改。作者的证据账本是在正文与原材料阅读后才查看，未继承作者自查结论。

## 实际覆盖

- 全文读取 `dist/content/ch07.json`：4课，全部正文、步骤、表格、提示、术语、要点、11题及解析。
- 全文读取 `dist/content/ch08.json`：4课，全部正文、步骤、表格、提示、术语、要点、12题及解析。
- 全文读取 `dist/content/method.json`：6节，所有段落。
- 全文对照第七章112页提取文本、第八章84页提取文本、学习方法14页提取文本。原源提取文本的空白图页结合必要图像与作者全页视觉覆盖记录核对；本次审查没有声称自己另行扫描了全部210张原课件页图。
- 审查者另以原1280×720图逐张检查第七章65—69页CL快照、第八章33/36/38/40页数据并行、PS、AllReduce与SSP公式。CL通道方向、令牌数、标记位置及训练聚合公式均与改写相容。
- 独立打开CL原论文、Hadoop MRv1官方教程、PyTorch集合通信教程、TensorFlow Federated官方说明，对重点边界进行二次核对。
- 实际执行Python数值核对：平滑权重结果 A,B,A,C,A,B,A；7轮后当前权重归零；最大最小分配和为10；PageRank一轮为[1/3,23/120,19/40]，和1；FedAvg=1.1；两章JSON及答案索引有效。

## 内容判断

本轮未发现阻断发布的事实或机制缺陷。此判断只覆盖本文件记录的内容与机制图，不替代整站浏览器、实验行为或手机像素验收。

| 主题 | 审查证据与结论 |
|---|---|
| CL快照 | 明确可靠FIFO，正确区分进程快照与通道状态；第一标记的入通道为空，其他通道记录到各自标记；3+2+1=6可复算。未把CL直接等同完整部署恢复能力。 |
| 检查点与日志 | 保留孤儿消息、恢复线、多米诺、稳定日志和可重放非确定性条件；正确解释DEP/COPY的职责，未把“强制失效”写成损坏机器。 |
| 调度与公平 | 局部性与等待成本分开；轮询只平均任务数；DRF按归一化主导份额比较，内存闲置并非自动错误；最大最小公平没有承诺不存在的最低需求保证。 |
| Shuffle与恢复 | Combine/Combiner和Merge已分开；只给适合合并的sum例子，平均值反例正确；MRv1与YARN明确分代；中间输出本地性和可靠最终输出不同。 |
| 图计算 | BSP消息进入下一超步、活跃与终止条件清楚；PageRank数值、出链分摊和无出链例外正确；切边/切点、GAS、Push/Pull与同步方式没有偷换。 |
| 分布式训练 | 数据并行和模型并行职责清楚；PS不是一台服务器；AllReduce定义与Ring实现分开；SSP示例满足计数约束；同步不能单独保证高精度、权重之外恢复状态均已说明。 |
| 联邦 | 两种分类维度、FedAvg加权、链路加密/安全聚合/DP职责、Non-IID与系统快慢分开；一般框架没有被冒充完整联邦隐私协议。 |
| 云边端 | 交付责任、声明式控制循环、容器隔离与应用恢复区分；卸载55/125ms可复算；服务放置、迁移、卸载对象不同；历史系统例子与当前可用产品未混用。 |
| 学习方法 | 保留具体追问、反例、独立推导、读diff与验证层次；未把复述一次、题答对或阅读记录当掌握，也未把多模型相同回答当证明。 |
| 原知识保留 | 逐页文本与重组位置可对应；删除的是重复动画、无可靠依据模型规模、绝对化营销结论。未发现必须补回的核心过程。框架列表仅作定位，不以名称替代机制。 |

一手核对入口：[CL原论文](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/12/Determining-Global-States-of-a-Distributed-System.pdf)、[Hadoop MRv1教程](https://hadoop.apache.org/docs/stable1/mapred_tutorial.html)、[PyTorch分布式通信](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html)、[TFF联邦学习](https://www.tensorflow.org/federated/federated_learning)。

## 新机制图独立检查

源：`dist/assets/snapshot.svg`、`snapshot-mobile.svg`、`parameter-server.svg`、`allreduce.svg`，配套 `dist/diagrams.js`。

审查者使用bundled Node的sharp，以144 DPI实际转出4张PNG，保存于 `evidence/review-07-08-diagrams/`，并逐张用view_image查看。没有用只读SVG源码替代实际图像审查。

| 图 | 技术核对 | 独立图像观察 |
|---|---|---|
| snapshot.svg | 横向时间；P1先存3，P2发送m后存2；m早于P2→P1标记到达，记录窗口终止于标记；3+2+1=6。虚线标记与实线业务消息一致。 | 时间向右、主体、记录点、通道窗口与箭头可分辨，无标签遮挡关键端点。 |
| snapshot-mobile.svg | 纵向时间与桌面等价；发送m在P2存档前，接收m在P1存档后且在关闭通道前。 | 两泳道、虚线、业务箭头与通道记录可分辨；数值3/2/1保留，合计6在相邻正文/alt中。 |
| parameter-server.svg | A/B梯度2/4，等样本、W=10、η=.1时均值3、更新9.7正确；Server执行更新，Worker贡献梯度。 | 各主体与上下数据方向可辨；存在下述非阻断图例措辞建议。 |
| allreduce.svg | A/B起点10，聚合后各得平均梯度3，各自更新9.7；图中归约框是集合操作抽象，不单列中心参数服务器。 | 输入、共同梯度和两个本地输出都可读，箭头连贯；图注明确同轮、等样本、学习率及同步成本。 |

配套图注已全文核对：CL的记录方向、通道FIFO和不可修改已拍本地快照均正确；PS/AllReduce图注明确同步例子、等样本、初值10、学习率0.1，并未把二者的更新位置混在一起。图作者仍需在整站实际宽度下做桌面/390px验收，此独立检查不代签页面像素通过。

## 非阻断建议与状态

1. `parameter-server.svg`图例“虚线：拉参数”：虚线实际箭头从Server指向Worker，表示拉取请求的返回数据。建议改为“虚线：返回参数”或“虚线：Pull返回”，明确这是参数数据流而非请求方向。它不改变机制，现有正文也讲了Worker发起Pull；由图作者决定并修正。本审查者未改作者或绘图者文件。
2. 可选教学增强：08-02的Ring阶段可以再用一个分段展示“沿环累加→完整片段→分发”，但当前已给输入、共同输出、Reduce-scatter/All-gather与通信条件，未构成解释缺口，不应为此扩大首版范围。

## 绑定的实际审读版本

以下哈希只绑定本轮已经读过的字节，不作为阅读或质量证据本身。若有实质修改，应按差异复核，不可仅更新哈希继承本结论。

| 文件 | SHA256 |
|---|---|
| ch07.json | 381168E98668E9747E74469A3321CF33A4EF62938A20B7445E9350FCBE297FA6 |
| ch08.json | DA84E9358401B4F2B374C45D34CB84AD94E1A294259F80B2E26F977AF4709AF1 |
| method.json | 6A7EE823A1EA9587855C22AEA31CE12666EE78DC4568F31D7013065780E012EB |
| snapshot.svg | A3CEEB8993D39192319C45924254E59E5FEDBCC100B98FAD7E95DC568B2BAD38 |
| snapshot-mobile.svg | 91C0528F9612F07AAEFDFBDA4C6390292980BB2AEEFDFCCD2D601F05C5EDC2D5 |
| parameter-server.svg | 3FD143AEB268CF26F5335DB460EEDB3FFAD6862F0751F56284693C84A441A209 |
| allreduce.svg | 21E6E0C4FB12BBF0371DB5FFF087E1FC30B99A1D9FA40C53E032059731735787 |
| diagrams.js | 6A81112BDCAF3404CAB32B47CCEC36CABB56618F537BAFE52B23B56FDE0DF376 |

## 复核后修订（主代理）

复审者指出参数服务器图例容易把返回数据流误读为请求方向。随后将 `parameter-server.svg` 的“虚线：拉参数”改为“虚线：返回参数”，图中仍由 Server 指向 Worker；机制和样例数值未改。主代理在桌面与390px移动布局重新查看了修订后的图，箭头方向、图例和相邻讲解一致。此处小改动由主代理作渲染核验，不冒称独立复审者查看过修订后的文件。修订后 `parameter-server.svg` SHA256：`684E3AE46A0935F76D81864B27808B0008A8721E37921AD6ADC1C9BBD69D171C`。
